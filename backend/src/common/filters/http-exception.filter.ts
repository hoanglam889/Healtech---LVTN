import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService, I18nContext, I18nValidationException } from 'nestjs-i18n';

const HTTP_ERROR_CODES: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE_ENTITY',
  500: 'INTERNAL_SERVER_ERROR',
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const lang = I18nContext.current(host)?.lang ?? 'vi';

    let statusCode: number;
    let message: string;
    let errors: Array<{ field: string | null; message: string }> | null = null;

    if (exception instanceof I18nValidationException) {
      statusCode = exception.getStatus();
      message = await this.t('errors.validation', lang);
      errors = await this.buildValidationErrors(exception.errors as any[], lang);
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse() as any;

      if (typeof res === 'object' && res?.i18nKey) {
        message = await this.t(res.i18nKey, lang, res.args);
      } else if (Array.isArray(res?.message)) {
        // Standard ValidationPipe produces { message: string[] }
        message = await this.t('errors.validation', lang);
        errors = res.message.map((msg: string) => ({ field: null, message: msg }));
      } else if (typeof res === 'string') {
        message = res;
      } else {
        message = res?.message ?? (await this.t(`errors.http.${statusCode}`, lang));
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = await this.t('errors.http.500', lang);
      console.error('[Healtech] Unhandled exception:', exception);
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      error: HTTP_ERROR_CODES[statusCode] ?? 'ERROR',
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private async t(key: string, lang: string, args?: Record<string, any>): Promise<string> {
    try {
      return (await this.i18n.translate(key, { lang, args })) as string;
    } catch {
      return key;
    }
  }

  private async buildValidationErrors(errors: any[], lang: string) {
    const result: Array<{ field: string; message: string }> = [];

    for (const err of errors) {
      const constraints: Record<string, string> = err.constraints ?? {};
      const contexts: Record<string, any> = err.contexts ?? {};

      for (const constraintName of Object.keys(constraints)) {
        const i18nCtx = contexts[constraintName]?.i18n;
        let msg: string;

        if (i18nCtx?.key) {
          msg = await this.t(i18nCtx.key, lang, i18nCtx.args);
        } else {
          msg = constraints[constraintName];
        }

        result.push({ field: err.property, message: msg });
      }

      if (err.children?.length) {
        result.push(...(await this.buildValidationErrors(err.children, lang)));
      }
    }

    return result;
  }
}

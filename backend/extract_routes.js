const fs = require('fs');
const path = require('path');

const files = [
    'src/app.controller.ts',
    'src/admin/admin.controller.ts',
    'src/ai/ai.controller.ts',
    'src/appointment-services/appointment-services.controller.ts',
    'src/appointments/appointments.controller.ts',
    'src/articles/articles.controller.ts',
    'src/auth/auth.controller.ts',
    'src/doctor-profiles/doctor-profiles.controller.ts',
    'src/invoices/invoices.controller.ts',
    'src/mail/mail.controller.ts',
    'src/patients/patients.controller.ts',
    'src/payments/payments.controller.ts',
    'src/ratings/ratings.controller.ts',
    'src/services/services.controller.ts',
    'src/specialties/specialties.controller.ts',
    'src/upload/upload.controller.ts'
];

const results = {};

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) return;
    const content = fs.readFileSync(fullPath, 'utf8');
    
    let controllerMatch = content.match(/@Controller\(['"]?([^'"]*)['"]?\)/);
    let baseRoute = controllerMatch ? controllerMatch[1] : '';
    if (baseRoute === undefined) baseRoute = '';
    
    const methodRegex = /@(Get|Post|Put|Delete|Patch)\(['"]?([^'"]*)['"]?\)?\s*[\n\r]*\s*(?:async\s+)?([a-zA-Z0-9_]+)\s*\(/g;
    
    const endpoints = [];
    let match;
    while ((match = methodRegex.exec(content)) !== null) {
        endpoints.push({
            method: match[1].toUpperCase(),
            path: match[2] ? `/${match[2]}` : '',
            functionName: match[3]
        });
    }
    
    // Sometimes paths are not explicitly provided in decorator, like @Get()
    const methodRegexEmpty = /@(Get|Post|Put|Delete|Patch)\(\)\s*[\n\r]*\s*(?:async\s+)?([a-zA-Z0-9_]+)\s*\(/g;
    while ((match = methodRegexEmpty.exec(content)) !== null) {
        // check if this function is already added
        if (!endpoints.find(e => e.functionName === match[2])) {
            endpoints.push({
                method: match[1].toUpperCase(),
                path: '',
                functionName: match[2]
            });
        }
    }

    results[file] = {
        baseRoute: `/${baseRoute}`,
        endpoints
    };
});

console.log(JSON.stringify(results, null, 2));

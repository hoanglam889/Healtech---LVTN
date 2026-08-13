"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAppointmentServiceDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_appointment_service_dto_1 = require("./create-appointment-service.dto");
class UpdateAppointmentServiceDto extends (0, mapped_types_1.PartialType)(create_appointment_service_dto_1.CreateAppointmentServiceDto) {
}
exports.UpdateAppointmentServiceDto = UpdateAppointmentServiceDto;
//# sourceMappingURL=update-appointment-service.dto.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDoctorProfileDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_doctor_profile_dto_1 = require("./create-doctor-profile.dto");
class UpdateDoctorProfileDto extends (0, mapped_types_1.PartialType)(create_doctor_profile_dto_1.CreateDoctorProfileDto) {
}
exports.UpdateDoctorProfileDto = UpdateDoctorProfileDto;
//# sourceMappingURL=update-doctor-profile.dto.js.map
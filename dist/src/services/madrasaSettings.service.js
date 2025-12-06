"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.madrasaSettingsService = void 0;
const madrasaSettings_repository_1 = require("../Repositories/madrasaSettings.repository");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class MadrasaSettingsService {
    async get() {
        return madrasaSettings_repository_1.madrasaSettingsRepository.get();
    }
    async create(data, logoPath) {
        if (logoPath) {
            data.logo = logoPath;
        }
        return madrasaSettings_repository_1.madrasaSettingsRepository.create(data);
    }
    async update(data, logoPath) {
        const existingMadrasa = await madrasaSettings_repository_1.madrasaSettingsRepository.get();
        if (logoPath && existingMadrasa && existingMadrasa.logo) {
            const oldLogoPath = path_1.default.join(__dirname, '../../', existingMadrasa.logo);
            if (fs_1.default.existsSync(oldLogoPath)) {
                fs_1.default.unlinkSync(oldLogoPath);
            }
        }
        if (logoPath) {
            data.logo = logoPath;
        }
        return madrasaSettings_repository_1.madrasaSettingsRepository.update(data);
    }
}
exports.madrasaSettingsService = new MadrasaSettingsService();

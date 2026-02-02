import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    async getSettings() {
        const settings = await this.prisma.systemSetting.findMany();
        // Convert array to object { key: value }
        return settings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
    }

    async updateSettings(data: Record<string, string>) {
        const updates = Object.entries(data).map(([key, value]) =>
            this.prisma.systemSetting.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            }),
        );
        await this.prisma.$transaction(updates);
        return this.getSettings();
    }
}

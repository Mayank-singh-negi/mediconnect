import { IsNotEmpty, IsUUID, IsOptional, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class PrescriptionItemDto {
  @IsNotEmpty()
  medicineName: string;

  @IsOptional()
  dosage?: string;

  @IsOptional()
  timing?: string[];

  @IsOptional()
  foodInstruction?: string;

  @IsOptional()
  durationDays?: number;
}

export class CreatePrescriptionDto {
  @IsUUID()
  appointmentId: string;

  @IsUUID()
  doctorId: string;

  @IsUUID()
  patientId: string;

  @IsOptional()
  notes?: string;

  @IsOptional()
  followUpDate?: string;

  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items: PrescriptionItemDto[];
}

import { Injectable } from '@nestjs/common';
import { Ship } from '../../../../domain/ship';
import { ShipEntity } from '../entities/ship.entity';

@Injectable()
export class ShipMapper {
  toDomain(entity: ShipEntity): Ship {
    return new Ship({
      ...entity,
      id: entity.id,
      plate_number: entity.plate_number,
      locationcode: entity.locationcode,
      trackingid: entity.trackingid,
      nkkt: entity.nkkt,
      ownercode: entity.ownercode,
      captioncode: entity.captioncode,
      businesscode: entity.businesscode,
      business2code: entity.business2code,
      business3code: entity.business3code,
      business4code: entity.business4code,
      licenseid: entity.licenseid,
      length: entity.length,
      congsuat: entity.congsuat,
      state: entity.state,
      HoHieu: entity.HoHieu,
      CoHieu: entity.CoHieu,
      IMO: entity.IMO,
      CangCaDangKyCode: entity.CangCaDangKyCode,
      CangCaPhuCode: entity.CangCaPhuCode,
      TongTaiTrong: entity.TongTaiTrong,
      ChieuRongLonNhat: entity.ChieuRongLonNhat,
      MonNuoc: entity.MonNuoc,
      SoThuyenVien: entity.SoThuyenVien,
      NgaySanXuat: entity.NgaySanXuat,
      NgayHetHan: entity.NgayHetHan,
      DungTichHamCa: entity.DungTichHamCa,
      VanTocDanhBat: entity.VanTocDanhBat,
      VanTocHanhTrinh: entity.VanTocHanhTrinh,
      name: entity.name,
      status: entity.status,
      last_report_id: entity.last_report_id,
      lastReport: entity.lastReport
        ? {
            id: entity.lastReport.id,
            lat: Number(entity.lastReport.lat),
            lng: Number(entity.lastReport.lng),
            reported_at: entity.lastReport.reported_at,
            status: entity.lastReport.status,
            port_code: entity.lastReport.port_code ?? null,
            description: entity.lastReport.description ?? null,
            created_at: entity.lastReport.created_at,
            updated_at: entity.lastReport.updated_at,
            source: entity.lastReport.source ?? 'web',
          }
        : null,
    });
  }

  toEntity(domain: Ship): ShipEntity {
    const entity = new ShipEntity();
    entity.id = domain.id;
    entity.plate_number = domain.plate_number;
    entity.locationcode = domain.locationcode;
    entity.trackingid = domain.trackingid;
    entity.nkkt = domain.nkkt;
    entity.ownercode = domain.ownercode;
    entity.captioncode = domain.captioncode;
    entity.businesscode = domain.businesscode;
    entity.business2code = domain.business2code;
    entity.business3code = domain.business3code;
    entity.business4code = domain.business4code;
    entity.licenseid = domain.licenseid;
    entity.length = domain.length;
    entity.congsuat = domain.congsuat;
    entity.state = domain.state;
    entity.HoHieu = domain.HoHieu;
    entity.CoHieu = domain.CoHieu;
    entity.IMO = domain.IMO;
    entity.CangCaDangKyCode = domain.CangCaDangKyCode;
    entity.CangCaPhuCode = domain.CangCaPhuCode;
    entity.TongTaiTrong = domain.TongTaiTrong;
    entity.ChieuRongLonNhat = domain.ChieuRongLonNhat;
    entity.MonNuoc = domain.MonNuoc;
    entity.SoThuyenVien = domain.SoThuyenVien;
    entity.NgaySanXuat = domain.NgaySanXuat;
    entity.NgayHetHan = domain.NgayHetHan;
    entity.DungTichHamCa = domain.DungTichHamCa;
    entity.VanTocDanhBat = domain.VanTocDanhBat;
    entity.VanTocHanhTrinh = domain.VanTocHanhTrinh;
    entity.name = domain.name;
    return entity;
  }
}

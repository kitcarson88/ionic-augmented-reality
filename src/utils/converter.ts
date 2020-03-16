import { GpsInfoDTO, GpsCoordinatesDTO } from '../entities/dto/gpsInfoDTO';

import { PoiDTO } from '../entities/dto/poiDTO';
import { Poi } from '../entities/form/poi';

export class Converter
{
    //GPS INFOS
    public static gpsInfoDTOToGpsCoordinatesDTO(dto: GpsInfoDTO): GpsCoordinatesDTO
    {
        let coordinatesDTO = new GpsCoordinatesDTO();
        coordinatesDTO.latitude = dto.coords.latitude;
        coordinatesDTO.longitude = dto.coords.longitude;
        coordinatesDTO.altitude = dto.coords.altitude;
        return coordinatesDTO;
    }

    public static poiDTOToPoi(dto: PoiDTO): Poi
    {
        let poi = new Poi();

        poi.latitude = dto.latitudine;
        poi.longitude = dto.longitudine;
        poi.title = dto.titolo;
        poi.description = dto.descrizione;

        return poi;
    }

    public static poiDTOArrayToPoiArray(dtoArray: PoiDTO[]): Poi[]
    {
        return dtoArray.map(dto => Converter.poiDTOToPoi(dto));
    }
}
import { GpsInfoDTO, GpsCoordinatesDTO } from "../entities/dto/gpsInfoDTO";

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
}
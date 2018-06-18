import { Component, Input } from "@angular/core";
import { AlbumOutDto } from "../../models/albumOutDto";

@Component({
    selector: 'album-card',
    templateUrl: 'album-card.html'
})
export class AlbumCard {
    @Input() album: AlbumOutDto;
}
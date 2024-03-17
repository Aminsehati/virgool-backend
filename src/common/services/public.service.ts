import { Injectable } from '@nestjs/common';


@Injectable()
export class PublicService {
    generateSlug(str: string) {
        if (!str) {
            return '';
        }
        let titleStr = str.replace(/^\s+|\s+$/g, '');
        titleStr = titleStr.toLowerCase();
        //persian support
        titleStr = titleStr
            .replace(/[^a-z0-9_\s-ءاأإآؤئبتثجحخدذرزسشصضطظعغفقكلمنهويةى]#u/, '')
            // Collapse whitespace and replace by -
            .replace(/\s+/g, '-')
            // Collapse dashes
            .replace(/-+/g, '-');
        titleStr = titleStr;
        return titleStr;
    }
}
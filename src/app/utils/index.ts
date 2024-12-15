import moment from './../libs/momentjs';

export function convertformatDateAngolan(date: Date): string {
    return moment(date).format("DD-MM-YYYY").toString();
}
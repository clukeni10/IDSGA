import moment from 'moment';
import tz from 'moment-timezone'
import 'moment/dist/locale/pt'

moment.locale('pt');

export default moment
export const momentTz = tz
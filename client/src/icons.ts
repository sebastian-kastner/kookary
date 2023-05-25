import { addIcon } from '@iconify/vue/dist/offline';

import burger from '@iconify-icons/bi/list';
import trash from '@iconify-icons/bi/trash';
import xCircle from '@iconify-icons/bi/x-circle';
import checkCircle from '@iconify-icons/bi/check-circle';
import circle from '@iconify-icons/bi/circle';
import people from '@iconify-icons/bi/people';
import person from '@iconify-icons/bi/person';
import personCircle from '@iconify-icons/bi/person-circle';
import pencil from '@iconify-icons/bi/pencil';
import basket from '@iconify-icons/bi/basket';
import bag from '@iconify-icons/bi/bag';
import bell from '@iconify-icons/bi/bell';
import bellFill from '@iconify-icons/bi/bell-fill';
import toggleOn from '@iconify-icons/bi/toggle-on';
import toggleOff from '@iconify-icons/bi/toggle-off';
import boxArrowInLeft from '@iconify-icons/bi/box-arrow-in-left';
import boxArrowInRight from '@iconify-icons/bi/box-arrow-in-right';
import arrowDownUp from '@iconify-icons/bi/arrow-down-up';
import calendarWeek from '@iconify-icons/bi/calendar-week';
import plusCircle from '@iconify-icons/bi/plus-circle';
import plus from '@iconify-icons/bi/plus';

export function addIcons() {
  addIcon('burgerMenu', burger);
  addIcon('trash', trash);
  addIcon('xCircle', xCircle);
  addIcon('checkCircle', checkCircle);
  addIcon('circle', circle);
  addIcon('people', people);
  addIcon('person', person);
  addIcon('personCircle', personCircle);
  addIcon('pencil', pencil);
  addIcon('basket', basket);
  addIcon('bag', bag);
  addIcon('bell', bell);
  addIcon('bellFill', bellFill);
  addIcon('toggleOn', toggleOn);
  addIcon('toggleOff', toggleOff);
  addIcon('boxArrowInLeft', boxArrowInLeft);
  addIcon('boxArrowInRight', boxArrowInRight);
  addIcon('arrowDownUp', arrowDownUp);
  addIcon('calendarWeek', calendarWeek);
  addIcon('plusCircle', plusCircle);
  addIcon('plus', plus);
}
import { useEffect } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import "../css/DatePicker.css"

library.add(faAngleLeft, faAngleRight);

export default function MyDatePicker() {
    useEffect(() => {
        // Initialize Datepicker
        $('#events-calendar').datepicker({
            prevText: "<",
            nextText: ">",
            minDate:0
        });
    }, []);

    return (
        <div id="events-calendar"></div>
    );
};
  

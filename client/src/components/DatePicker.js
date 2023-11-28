import { useEffect } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

library.add(faAngleLeft, faAngleRight);

export default function MyDatePicker() {
    useEffect(() => {
        // Initialize Datepicker
        $('#events-calendar').datepicker({
            prevText: "<",
            nextText: ">"
        });
    }, []);

    return (
        <div id="events-calendar"></div>
    );
};
  

import "react-date-range/dist/theme/default.css";
import "react-date-range/dist/styles.css";
import { DateRangePicker } from "react-date-range";
import { SetStateAction, useState } from "react";

const Search = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [show,setShow] = useState(false);

  const handleSelect = (date: { selection: { startDate: SetStateAction<Date>; endDate: SetStateAction<Date>; }; }) => {
    // console.log("Shaswat");
    setStartDate(date.selection?.startDate);
    setEndDate(date.selection?.endDate);
    // TO Do Call api to send below data
    // console.log(date.selection.startDate);
    // console.log(date.selection.endDate);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  return(
    <>
        <div>
        <button type="button" onClick={()=>setShow(!show)} className='d-flex justify-content-end'>Search By Date</button>
            {
                show && <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} />
            }
            
        </div>
        
    </>
  )
};

export default Search;

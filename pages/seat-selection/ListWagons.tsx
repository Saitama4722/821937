import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { slicePriceState, totalChoiceRoute } from '../../store/slicePrice';
import { clearStepAll } from '../../store/sliceBarProgress';
import { wagonClassTypes } from '../../utils/wagonClassTypes';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ISeats } from '../../models/interfaces';
import { sliceChoiceState } from '../../store/sliceChoice';
import { sliceGetSeatsState } from '../../store/sliceGetSeats';
import { TypeWagon } from './components/TypeWagon';
import './list-wagons.css';

type StateButton = {
  disabled: boolean,
  className: string
}

export const ListWagons = () => {
	const { items } = useAppSelector(sliceGetSeatsState);
  const { route } = useAppSelector(sliceChoiceState);
  const navigate = useNavigate();
  const [types, setTypes] = useState<ISeats[][]>([]);
  const [button, setButton] = useState<StateButton>({ disabled: true, className: '-disable' });
  const dispatch = useAppDispatch();
  const { totalSeatsAge, totalSeatsChild, totalAmountTickets } = useAppSelector(slicePriceState);

  useEffect(() => {
    dispatch(clearStepAll());
  }, [dispatch]);

  useEffect(() => {
    if (items.length) {
      setTypes(wagonClassTypes(items));
    }
  }, [items]);

  useEffect(() => {
    if (totalAmountTickets === 0 && (totalSeatsAge !== 0 || totalSeatsChild !== 0)) {
      setButton({ disabled: false, className: '' })
    } else {
      setButton({ disabled: true, className: '-disable' });
    };
  }, [totalAmountTickets, totalSeatsAge, totalSeatsChild]);

  function toPassengers() {
    navigate('/ticket/passengers');
    dispatch(totalChoiceRoute());
  };

	return (
		<div className='wagons'>
			<h2 className='wagons__title'>выбор мест</h2>

			{types.map((elem, i) => <TypeWagon coaches={elem} route={route} classStyle={i % 2 === 0 ? '-departure' : '-return'} key={i} />)}

			<button className={`wagon__button${button.className}`} type='button' disabled={button.disabled} onClick={toPassengers}>далее</button>
		</div>
	)
};
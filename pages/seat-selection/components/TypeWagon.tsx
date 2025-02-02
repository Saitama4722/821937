import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { dateFromAndTo, durationTrip } from '../../../utils/trainDate';
import { useEffect } from 'react';
import { clearAllFiltering } from '../../../store/sliceFilter';
import { changeAgeTickets, changeChildTickets, changeChildWithoutTickets, clearAllPrices, clearTotalPrice, slicePriceState } from '../../../store/slicePrice';
import { IItem, ISeats } from '../../../models/interfaces';
import { Wagon } from './Wagon';
import '../list-wagons.css';

type Props = {
	route: IItem | null,
	coaches: ISeats[],
	classStyle: string
}

export const TypeWagon = ({ route, coaches, classStyle }: Props) => {
	const [time, setTime] = useState({ hours: '', mins: '' });

	const [type, setType] = useState({
		first: false,
		second: false,
		third: false,
		fourth: false
	});

	const [valueAges, setValueAges] = useState(0);
	const [valueChild, setValueChild] = useState(0);
	const [valueChildWithout, setValueChildWithout] = useState(0);
	const { firstClass, secondClass, thirdClass, fourthClass } = useAppSelector(slicePriceState);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const time = durationTrip(route?.departure.duration);
		const timeArr = time.split(':');
		setTime({ hours: timeArr[0], mins: timeArr[1] });
		const typesObj = {
			first: false,
			second: false,
			third: false,
			fourth: false
		};

		for (const el of coaches) {
			if (el.coach.class_type === 'first') {
				typesObj.first = true;
			};
			if (el.coach.class_type === 'second') {
				typesObj.second = true;
			};
			if (el.coach.class_type === 'third') {
				typesObj.third = true;
			};
			if (el.coach.class_type === 'fourth') {
				typesObj.fourth = true;
			};
		};

		setType(typesObj);
	}, [coaches, route?.departure.duration]);

	useEffect(() => {
		if (valueAges < valueChildWithout) {
			setValueChildWithout(valueAges);
		};
	}, [valueAges, valueChildWithout]);

	const handleInputAges = () => {
		if (valueAges < 5) {
			const newValue = valueAges + 1;
			setValueAges(newValue);
			dispatch(changeAgeTickets({ classType: coaches[0].coach.class_type, seatsAge: newValue }));
		}
	};

	const handleInputChild = () => {
		if (valueChild < 5) {
			const newValue = valueChild + 1;
			setValueChild(newValue);
			dispatch(changeChildTickets({ classType: coaches[0].coach.class_type, seatsChild: newValue }));
		}
	};

	const handleInputChildWithout = () => {
		if (valueChildWithout < valueAges) {
			const newValue = valueChildWithout + 1;
			setValueChildWithout(newValue);
			dispatch(changeChildWithoutTickets(newValue));
		}
	};

	function inputAges(event: ChangeEvent<HTMLInputElement>) {
		if (/^[0-5]$/.test(event.target.value)) {
			dispatch(changeAgeTickets({ classType: coaches[0].coach.class_type, seatsAge: Number(event.target.value) }));
			setValueAges(Number(event.target.value));
		};
	};

	function inputChild(event: ChangeEvent<HTMLInputElement>) {
		if (/^[0-5]$/.test(event.target.value)) {
			dispatch(changeChildTickets({ classType: coaches[0].coach.class_type, seatsChild: Number(event.target.value) }));
			setValueChild(Number(event.target.value));
		};
	};

	function inputChildWithout(event: ChangeEvent<HTMLInputElement>) {
		if (Number(event.target.value) >= 0 && Number(event.target.value) <= valueAges) {
			dispatch(changeChildWithoutTickets(Number(event.target.value)));
			setValueChildWithout(Number(event.target.value));
		};
	};

	function backToRoutes() {
		navigate('/ticket');
		dispatch(clearAllPrices());
		dispatch(clearTotalPrice());
		dispatch(clearAllFiltering());
	};

	return (
		<div className='wagon'>
			<div className={`choice__train${classStyle}`}>
				<span className={`choice__train-img${classStyle}`}></span>
				<button className='choice__train-btn' type='button' onClick={backToRoutes}>Выбрать другой поезд</button>
			</div>

			<div className='wagon__train'>
				<div className='wagon__train-route'>
					<span className='wagon__train-img'></span>
					<div className='wagon__train-description'>
						<h3 className='train__description-name'>{route?.departure.train.name}</h3>
						<p className='train__description-city'>{route?.departure.from.city.name} &#8594;</p>
						<p className='train__description-city'>{route?.departure.to.city.name} &#8594;</p>
						<p className='train__description-city'>{route?.departure.to.city.name}</p>
					</div>
				</div>

				<div className='wagon__direction-time'>
					<div className='wagon__direction-city'>
						<h3 className='wagon__time'>{dateFromAndTo(route?.departure.from.datetime)}</h3>
						<p className='wagon__direction-name'>{route?.departure.from.city.name}</p>
						<p className='wagon__direction-station'>{`${route?.departure.from.railway_station_name} вокзал`}</p>
					</div>
					<div className='direction__arrow'></div>
					<div className='wagon__direction-city-arrival'>
						<h3 className='wagon__time'>{dateFromAndTo(route?.departure.to.datetime)}</h3>
						<p className='wagon__direction-name'>{route?.departure.to.city.name}</p>
						<p className='wagon__direction-station'>{`${route?.departure.to.railway_station_name} вокзал`}</p>
					</div>
				</div>

				<div className='wagon__duration'>
					<span className='wagon__duration-img'></span>
					<div className='wagon__duration-text'>
						<p>{time.hours} часов</p>
						<p>{time.mins} минуты</p>
					</div>
				</div>
			</div>

			<div className='amount__tickets'>
				<h3 className='amount__tickets-title'>Количество билетов</h3>
				<div className='tickets__age'>
					<div className='tickets__age-inputs' onClick={handleInputAges}>
						<input
							className='tickets__age-input'
							type="text"
							placeholder={`Взрослых — ${valueAges}`}
							value={''}
							onChange={inputAges}
						/>
						<p className='tickets__adults-description'>Можно добавить еще <br />{5 - valueAges} пассажиров</p>
					</div>

					<div className='tickets__age-inputs' onClick={handleInputChild}>
						<input
							className='tickets__age-input'
							type="text"
							placeholder={`Детских — ${valueChild}`}
							value={''}
							onChange={inputChild}
						/>
						<p className='tickets__adults-description'>Можно добавить еще {5 - valueChild} детей до 10 лет. Свое место в вагоне, как у взрослых, но дешевле
							в среднем на 50-65%</p>
					</div>
					<div className='tickets__age-inputs' onClick={handleInputChildWithout}>
						<input
							className='tickets__age-input'
							type="text"
							placeholder={`Детских \u00ABбез места\u00BB — ${valueChildWithout}`}
							value={''}
							onChange={inputChildWithout}
						/>
					</div>
				</div>
			</div>

			<div className='wagons__types'>
				<h3 className='wagon__type-title'>Тип вагона</h3>
				<div className='wagon__types'>
					<div className='wagon__type'>
						<span className={!type.fourth ? 'type__economy-img' : 'type__economy-img-active'}></span>
						<p className={!type.fourth ? 'type__text' : 'type__text-active'}>Сидячий</p>
					</div>
					<div className='wagon__type'>
						<span className={!type.third ? 'type__platzkart-img' : 'type__platzkart-img-active'}></span>
						<p className={!type.third ? 'type__text' : 'type__text-active'}>Плацкарт</p>
					</div>
					<div className='wagon__type'>
						<span className={!type.second ? 'type__coupe-img' : 'type__coupe-img-active'}></span>
						<p className={!type.second ? 'type__text' : 'type__text-active'}>Купе</p>
					</div>
					<div className='wagon__type'>
						<span className={!type.first ? 'type__lux-img' : 'type__lux-img-active'}></span>
						<p className={!type.first ? 'type__text' : 'type__text-active'}>Люкс</p>
					</div>
				</div>

				<div className='wagons__numbers-wrap'>
					<div className='wagons__numbers'>
						<p className='wagons__numbers-title'>Вагоны&nbsp;</p>

						{coaches.map((elem, i) => {
							const wagonNumber = elem.coach.name.replace(/\D/g, ''); // Удаляет все нечисловые символы
							return (
								<span className='wagons__numbers-current' key={elem.coach._id}>
									{wagonNumber}{i < coaches.length - 1 ? '\u00A0' : ''} {/* Используем неразрывный пробел */}
								</span>
							);
						})}
					</div>
					<p className='wagons__numbers-text'>Нумерация вагонов начинается с головы поезда</p>
				</div>

				{coaches.map((elem, i) => <Wagon
					classStyle={(coaches.length - 1) === i ? '' : 'wagon__description'}
					coach={elem}
					key={elem.coach._id} />)}
			</div>

			<div className={
				coaches[0].coach.class_type === 'first' ? firstClass.totalPrice === 0 ? 'hide-section' : 'total__price' :
					coaches[0].coach.class_type === 'second' ? secondClass.totalPrice === 0 ? 'hide-section' : 'total__price' :
						coaches[0].coach.class_type === 'third' ? thirdClass.totalPrice === 0 ? 'hide-section' : 'total__price' :
							fourthClass.totalPrice === 0 ? 'hide-section' : 'total__price'
			}>{
					coaches[0].coach.class_type === 'first' ? firstClass.totalPrice :
						coaches[0].coach.class_type === 'second' ? secondClass.totalPrice :
							coaches[0].coach.class_type === 'third' ? thirdClass.totalPrice :
								fourthClass.totalPrice
				}<span className="currency-symbol"></span>
			</div>
		</div >
	);

};
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IItem } from '../../models/interfaces';
import { TrainSeatsInfo } from '../../models/index';
import { useAppDispatch } from '../../store/hooks';
import { choiceRoute } from '../../store/sliceChoice';
import { getSeatsThunk } from '../../store/sliceGetSeats';
import { addRouteId, clearOrder } from '../../store/sliceOrder';
import { createArray } from '../../utils/createTrainSeatsArray';
import { dateFromAndTo, durationTrip } from '../../utils/trainDate';
import { TrainSelectionSeats } from './TrainSelectionSeats';
import './train-selection.css';

type Props = {
    route: IItem,
    btnText?: string
};

export const TrainSelection = ({ route, btnText = 'Выбрать места' }: Props) => {
    const [train, setTrain] = useState<TrainSeatsInfo[]>([]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Функция для инициализации информации о поездах
    const initializeTrainInfo = (route: IItem) => {
        const arrayInfo: TrainSeatsInfo[] = [];

        if (route) {
            // Основная логика для поездов
            if (route.departure.have_first_class) {
                createArray(route, arrayInfo, 'first', 'Люкс');
            }
            if (route.departure.have_second_class) {
                createArray(route, arrayInfo, 'second', 'Купе');
            }
            if (route.departure.have_third_class) {
                createArray(route, arrayInfo, 'third', 'Плацкарт');
            }
            if (route.departure.have_fourth_class) {
                createArray(route, arrayInfo, 'fourth', 'Сидячий');
            }
            
            setTrain(arrayInfo);
        }
    };

    // Инициализируем информацию о поезде при изменении маршрута
    useEffect(() => {
        initializeTrainInfo(route);
    }, [route]);

    const getCoaches = () => {
        if (route) {
            dispatch(choiceRoute(route));
            dispatch(getSeatsThunk(route.departure._id));
            dispatch(addRouteId(route.departure._id));
            navigate('/ticket/wagon');
        }
    };

    const backOrder = () => {
        dispatch(clearOrder());
        navigate('/ticket');
    };

    return (
        <article className="train__option">
            {/* Отображение маршрута туда */}
            <div className="train__name">
                <span className="train__name-img"></span>
                <h4 className="train__name-number">{route.departure.train.name}</h4>
                <div className="train__name-destination">
                    <p className="train__name-city">{route.departure.from.city.name}&#8594;</p>
                    <p className="train__name-city">{route.departure.to.city.name}</p>
                </div>
            </div>

            <div className="train__destination">
                <div className="train__destination-route">
                    <div className="train__destination-from">
                        <p className="destination__time">{dateFromAndTo(route.departure.from.datetime)}</p>
                        <div className="destination__from">
                            <p className="destination__city">{route.departure.from.city.name}</p>
                            <p className="destintion__station">{route.departure.from.railway_station_name} вокзал</p>
                        </div>
                    </div>
                    <div className="train__destination-time">
                        <p className="travel__time">{durationTrip(route.departure.duration)}</p>
                        <span className="destination__arrow"></span>
                    </div>
                    <div className="train__destination-to">
                        <p className="destination__time">{dateFromAndTo(route.departure.to.datetime)}</p>
                        <div className="destination__to">
                            <p className="destination__city">{route.departure.to.city.name}</p>
                            <p className="destintion__station">{route.departure.to.railway_station_name} вокзал</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Добавляем блок для обратного маршрута */}
            {route.return && (
                <div className="train__name">
                    <span className="train__name-img"></span>
                    <h4 className="train__name-number">{route.return.train.name}</h4>
                    <div className="train__name-destination">
                        <p className="train__name-city">{route.return.from.city.name}&#8594;</p>
                        <p className="train__name-city">{route.return.to.city.name}</p>
                    </div>
                </div>
            )}

            {/* Блок для отображения информации о времени и станции обратного маршрута */}
            {route.return && (
                <div className="train__destination">
                    <div className="train__destination-route">
                        <div className="train__destination-from">
                            <p className="destination__time">{dateFromAndTo(route.return.from.datetime)}</p>
                            <div className="destination__from">
                                <p className="destination__city">{route.return.from.city.name}</p>
                                <p className="destintion__station">{route.return.from.railway_station_name} вокзал</p>
                            </div>
                        </div>
                        <div className="train__destination-time">
                            <p className="travel__time">{durationTrip(route.return.duration)}</p>
                            <span className="destination__arrow"></span>
                        </div>
                        <div className="train__destination-to">
                            <p className="destination__time">{dateFromAndTo(route.return.to.datetime)}</p>
                            <div className="destination__to">
                                <p className="destination__city">{route.return.to.city.name}</p>
                                <p className="destintion__station">{route.return.to.railway_station_name} вокзал</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="train__ticket-price">
                <div className="train__ticket-options">
                    {train.map((elem) =>
                        <TrainSelectionSeats
                            name={elem.name}
                            seats={elem.seats}
                            price={elem.price}
                            seatPrice={elem.seatPrice}
                            key={elem.name} />
                    )}
                </div>

                <div className="train__amenities">
                    <span className={`${route.departure.have_wifi ? 'amenities-wifi__includes' : 'train__amenities-wifi'}`}></span>
                    <span className={`${route.departure.is_express ? 'amenities-express__includes' : 'train__amenities-express'}`}></span>
                    <span className={`${route.departure.have_air_conditioning ? 'amenities-coffee__includes' : 'train__amenities-coffee'}`}></span>
                </div>

                {btnText !== 'Изменить' ?
                    <button type='button' className='choice-train__btn' onClick={getCoaches}>{btnText}</button> :
                    <button type='button' className='order__route-btn' onClick={backOrder}>{btnText}</button>}
            </div>
        </article>
    );
};

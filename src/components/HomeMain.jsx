import React, { useEffect, useState } from 'react';
import Switch from 'react-switch';
import call_api from '../services/request';
import SensorChart from './SensorChart';


function LedSensorBox({ handle, checked }) {
    return (
        <div className="full-height pt-5 border rounded shadow d-flex justify-content-around">
            <h4 >Led</h4>
            <Switch onChange={handle} checked={checked} />
        </div>
    );
}

function SoundSensorBox({ handle, data }) {
    let dataSensor = data;

    function handleChangeAuto() {
        dataSensor.auto = !dataSensor.auto;
        handle(dataSensor);
    };

    function handleChangeMaxRange(e) {
        dataSensor.max_range = parseInt(e.target.value);
        handle(dataSensor);
    };

    function handleChangeMinRange(e) {
        dataSensor.min_range = parseInt(e.target.value);
        handle(dataSensor);
    };

    return (
        <div className="full-height border rounded p-2 shadow">
            <div className="full-width d-flex">
                <h5 className="ml-4">Sound</h5>
                <h5 className="ml-auto mr-5">{data?.value}</h5>
            </div>
            <div className="full-width d-flex mt-2">
                <h5 className="ml-4">Auto</h5>
                <Switch className="ml-auto mr-5" onChange={handleChangeAuto} checked={data?.auto} />
            </div>
            <div className="full-width d-flex mt-2">
                <h5 className="ml-4">Range</h5>
                <input type="number" className="ml-4 input-width" onChange={handleChangeMaxRange} value={data?.max_range} />
                <input type="number" className="ml-auto mr-5 input-width" onChange={handleChangeMinRange} value={data?.min_range} />
            </div>
        </div>
    );
}

function MQ5SensorBox({ data }) {

    const status = data?.value > data?.danger ? "danger" : (data?.value > data?.warning ? "warning" : "safe")

    return (
        <div className={"full-height border rounded shadow border-" + status}>
            <h3 className="mt-2 ml-2">Gas Sensor</h3>
            <div className="full-width d-flex mt-3">
                <h5 className="ml-4">Value</h5>
                <h5 className="ml-auto mr-5">{data?.value}</h5>
            </div>
            <div className="full-width d-flex">
                <h4 className="ml-4">Status</h4>
                <h4 className={"ml-auto mr-5 text-uppercase text-" + status}>{status}</h4>
            </div>
        </div>
    );
}


function HomeMain() {

    const [dataChart, setDataChart] = useState([]);
    const [dataLed, setDataLed] = useState();
    const [dataMQ5, setDataMQ5] = useState();
    const [dataSound, setDataSound] = useState();

    async function getDataSensor() {
        const res = await call_api({
            method: 'GET',
            url: '/sensor'
        });

        const [led, dht11, mq5, sound] = res.data.data;
        setDataLed(led);
        setDataMQ5(mq5);
        setDataSound(sound);

        const _dataChart = dht11.data.map(item => [item.time, item.humidity, item.temperature]);
        _dataChart.unshift(['time', 'humidity', 'temperature']);

        setDataChart(_dataChart);
    }

    async function updateDataSensor(data) {
        const res = await call_api({
            method: 'PUT',
            url: '/sensor',
            data: {
                name: data.name,
                data: data.data
            }
        });
    }

    function handleChangeLedStatus() {
        const dataUpdate = {
            name: dataLed.name,
            data: {
                status: !dataLed.data.status
            }
        };
        setDataLed(dataUpdate);
        updateDataSensor(dataUpdate);
    };

    function handleChangeSoundData(data) {
        const dataUpdate = {
            name: dataSound.name,
            data: data
        };
        setDataSound(dataUpdate);
        updateDataSensor(dataUpdate);
    };

    useEffect(() => {
        getDataSensor();
        setInterval(async () => {
            await getDataSensor();
        }, 1000);
    }, []);

    return (
        <div className="p-2">
            <SensorChart data={dataChart} />
            <div className="row">
                <div className="ml-5 col-3">
                    <LedSensorBox handle={handleChangeLedStatus} checked={dataLed?.data.status} />
                </div>
                <div className="col-4">
                    <SoundSensorBox handle={handleChangeSoundData} data={dataSound?.data} />
                </div>
                <div className="col-4">
                    <MQ5SensorBox data={dataMQ5?.data}/>
                </div>
            </div>
        </div>
    );
}

export default HomeMain;
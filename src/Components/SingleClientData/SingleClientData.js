import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { auth } from '../../firebase/Firebase';
import { Avatar, Grid, Paper } from "@material-ui/core";
import { Alert, Button, CircularProgress, Divider, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {XYPlot, AreaSeries, LineSeries, LineMarkSeries, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, Hint, DiscreteColorLegend} from 'react-vis';
import { getClientData } from '../../firebase/Firebase';
import "./SingleClientData.css"
import "react-vis/dist/style.css";

const d3 = require('d3');

const createDateString = (value) =>
{
	let t = new Date(0);
	t.setSeconds(value/1000);
	let arr = t.toDateString().split(' ');
	let formatStr = arr[2] + '-' + arr[1] + '-' + arr[3].substring(2);
	return formatStr;
}

const formatData = (dataToFormat) =>
{
	//because react-vis requires sorted data
	let objs = Object.values(dataToFormat);
	let dates = [];
	objs.forEach((x)=> dates.push(new Date(Object.keys(x)[0])));
	let sortedKeys = dates.sort((a,b) => a - b );
	return sortedKeys;
}

const PCL5Chart = (props) => {
	const {retrievedInfo, width, height} = props;
	const [hintData, setHintData] = useState(null);
	const [dataExists, setDataExists] = useState(null);
	const onLine = useRef({});

	let pcl5Obj = {};

	const pcl5Colors = {
		Intrusion:"#6ED2EC",
		Avoidance:"#2D68DB",
		NegativeFeelings:"#B777FF",
		Hyperarousal:"#F976FE"
	}

	const legendItems = [
		{
			title:'Intrusion',
			color: pcl5Colors.Intrusion,
			strokeWidth: 20
		},
		{
			title:'Avoidance',
			color: pcl5Colors.Avoidance,
			strokeWidth: 20
		},
		{
			title:'Negative Feelings',
			color: pcl5Colors.NegativeFeelings,
			strokeWidth: 20
		},
		{
			title:'Hyperarousal',
			color: pcl5Colors.Hyperarousal,
			strokeWidth: 20
		}
	]

	retrievedInfo && retrievedInfo.PCL5 ? Object.keys(retrievedInfo.PCL5).forEach((key)=>
	{
		let sortedKeys = formatData(retrievedInfo.PCL5[key]);
		let data = [];
		const dates = [];
		sortedKeys.forEach((sortkey) =>
		{
			let index = retrievedInfo.PCL5[key].findIndex((obj) => new Date(Object.keys(obj)[0]).getTime() === new Date(sortkey).getTime());

			const x = new Date(sortkey);
			data.push({x, y: Object.values(retrievedInfo.PCL5[key][index])[0]});
			if (!dates.includes(x)) dates.push(x);
		});
		pcl5Obj[key] = data;
		pcl5Obj.xAxisVals = dates;
	}) : pcl5Obj = {};

	// check whether data exists or not
	let count = 0, total = 0;
	Object.keys(pcl5Obj).forEach((key) => {
		total++
		// if no data in key 
		if (pcl5Obj[key].length == 0) {
			count++
		}
	});
	useEffect(() => {
		if (count == total) {
			setDataExists(false);
		} else {
			setDataExists(true);
		}
	}, []);

	const setUpHint = (datapoint, e, type) => {
		// console.log(datapoint, e);
		// const hint = {
		// 	x: e.event.clientX,
		// 	y: e.event.pageY,
		// 	date: datapoint.x,
		// 	val: datapoint.y,
		// 	type
		// }
		datapoint.type = type;
		setHintData(datapoint);
	}

	return (
	<div>
	<h3>PCL-5</h3>
	
	{!dataExists && dataExists == false && 
	<Alert variant="filled" severity="info"> No data exists </Alert>}
	{dataExists && <XYPlot xType="time" stackBy="y" width={width} height={height}
		onMouseLeave={(e) => {setHintData(null)}}
	>
	<HorizontalGridLines />
	<XAxis tickValues={pcl5Obj.xAxisVals} tickFormat={(v) => createDateString(v)}/>
	<YAxis/>
	<AreaSeries
	  className="area-series-example"
	  curve="curveLinear"
	  data={pcl5Obj.Intrusion}
	  color={pcl5Colors.Intrusion}
	  onSeriesMouseOver={() => {onLine.current[0] = true}}
	  onSeriesMouseOut={() => {onLine.current[0] = false}}
	  onNearestXY={(datapoint, e) => {
			if (onLine.current[0]) setUpHint(datapoint, e, 'Intrusion')
		}}
	/>
	<AreaSeries
	  className="area-series-example"
	  curve="curveLinear"
	  data={pcl5Obj.Avoidance}
	  color={pcl5Colors.Avoidance}
	  onSeriesMouseOver={() => {onLine.current[1] = true}}
	  onSeriesMouseOut={() => {onLine.current[1] = false}}
	  onNearestXY={(datapoint, e) => {
			if (onLine.current[1]) setUpHint(datapoint, e, 'Avoidance')
		}}
	/>
	<AreaSeries
	  className="area-series-example"
	  curve="curveLinear"
	  data={pcl5Obj.NegativeFeelings}
	  color={pcl5Colors.NegativeFeelings}
	  onSeriesMouseOver={() => {onLine.current[2] = true}}
	  onSeriesMouseOut={() => {onLine.current[2] = false}}
	  onNearestXY={(datapoint, e) => {
			if (onLine.current[2]) setUpHint(datapoint, e, 'Negative Feelings')
		}}
	/>
	<AreaSeries
	  className="area-series-example"
	  curve="curveLinear"
	  data={pcl5Obj.Hyperarousal}
	  color={pcl5Colors.Hyperarousal}
	  onSeriesMouseOver={() => {onLine.current[3] = true}}
	  onSeriesMouseOut={() => {onLine.current[3] = false}}
	  onNearestXY={(datapoint, e) => {
			if (onLine.current[3]) setUpHint(datapoint, e, 'Hyperarousal')
		}}
	/>
	{hintData && <Hint value={hintData}>
		<Paper className='single-client-data-hint'>
				<h4>{hintData.type}</h4>
				<p>{createDateString(hintData.x.getTime())}</p>
				<p>Score: {hintData.y}</p>
		</Paper>
	</Hint>}
	<DiscreteColorLegend items={legendItems} orientation='horizontal' className="single-client-data-legend single-client-data-legend-pcl5"/>
  </XYPlot>}
  </div>);
}

function BuildPlot(props)
{
	let {
		retrievedInfo,
		trackedItem,
		timePeriod,
		width,
		height,
		legendTitle,
		descriptor
	} = props;

	let retData = [];
	let retPastData = []
	let data=[];
	let formattedTrackedItem;

	const [hintData, setHintData] = useState(null);
	const [pastHintData, setPastHintData] = useState(null);
	const [dataExists, setDataExists] = useState(null);

	const legendItems = [
		{
			title: legendTitle,
			strokeStyle: 'solid'
		},
		{
			title: 'previous period',
			strokeStyle: 'dashed'
		}
	]

	// create the x-axis labels
	const xAxisVals = [];
	const hiddenLineData = [];
	const today = new Date();
	let period = 2;	// the number of days to step the axis by
	let firstDay;
	let lastDay = today;
	if (timePeriod==='7days') firstDay = new Date(today.getTime() - 6.048e+8);
	else if (timePeriod==='28days') {
		firstDay = new Date(today.getTime() - 2.419e+9);
		period = 4;
	}
	else if (timePeriod==='1week') {
		const todayTmp = new Date();
		const firstDayOfWeek = new Date(todayTmp.setDate(todayTmp.getDate() - todayTmp.getDay()));
		firstDay = new Date(firstDayOfWeek.getTime() - 6.048e+8);
		lastDay = firstDayOfWeek;
	}
	// add a value every 4 days
	let currentDay = firstDay;
	while (currentDay.getTime() <= lastDay.getTime()) {
		xAxisVals.push(currentDay);
		hiddenLineData.push({
			x: currentDay,
			y:1
		});
		currentDay = new Date(currentDay.getTime() + (86400000*period));
	}

	//if (!retrievedInfo) return 'Awaiting data';
	let categories = Object.keys(retrievedInfo);
	if (!categories.includes(trackedItem)) console.log('ERROR, cannot track %s', trackedItem);
	else
	{
		let info = retrievedInfo[trackedItem];
		let availableTimePeriods = Object.keys(info);
		if (!availableTimePeriods.includes(timePeriod)) console.log('ERROR, cannot track %s at time period %s', trackedItem, timePeriod);
		else
		{
			let unsorted = info[timePeriod];
			let unsortedPast = info[timePeriod+"PriorPeriod"];
			let sortedKeys = formatData(unsorted);
			let sortedPastKeys = formatData(unsortedPast)
			sortedKeys.forEach((sortkey)=>
			{
				let index = unsorted.findIndex((obj) => new Date(Object.keys(obj)[0]).getTime() === new Date(sortkey).getTime());
				const x = new Date(sortkey);
				retData.push({x: x, y: Object.values(unsorted[index])[0]});
			});
			sortedPastKeys.forEach((sortkey) =>
			{
				let index = unsortedPast.findIndex((obj) => new Date(Object.keys(obj)[0]).getTime() === new Date(sortkey).getTime());
				let date = new Date(sortkey);
				let increment = 7;
				if (timePeriod === '28days') {
					increment = 28;
				}
				date.setDate(date.getDate() + increment);
				retPastData.push({x: date, y: Object.values(unsortedPast[index])[0]});
			})
			formattedTrackedItem = trackedItem.split(/(?=[A-Z])/).join(' ');
		}
	}

	// check whether data exists or not
	useEffect(() => {
		if (retData.length == 0) {
			setDataExists(false);
		} else {
			setDataExists(true);
		}
	}, [retData]);

	const setUpHint = (datapoint, {event}) => {
		console.log(datapoint);
		setPastHintData(null);
		// console.log(event);
		// const hint = {
		// 	x: event.screenX,
		// 	y: event.screenY,
		// 	date: datapoint.x,
		// 	val: datapoint.y
		// }

		setHintData(datapoint);
	}

	const setUpHintPast = (datapoint, {event}) => {
		console.log(datapoint);
		setHintData(datapoint);
		let date = new Date(datapoint.x.getTime());
		if (timePeriod === '28days') {
			date.setDate(date.getDate() - 28);
		} else {
			date.setDate(date.getDate() - 7);
		}
		setPastHintData(date);
		// console.log(event);
		// const hint = {
		// 	x: event.screenX,
		// 	y: event.screenY,
		// 	date: datapoint.x,
		// 	val: datapoint.y
		// }
	}

	const countEntries = (dataList, prevDataList) => {
		let count = 0;
		let prevCount = 0;
		let diff = 0;
		dataList.forEach((point) => {
			count += point.y;
		});
		prevDataList.forEach((p) => {
			prevCount += p.y;
		});
		if (trackedItem === 'AvgSymptomsRating'){
			count = count / dataList.length;
			prevCount = prevCount / dataList.length;
		} 
		diff = (count - prevCount) / prevCount;
		return (<div style={{display: 'flex'}}>
				<p>{count}</p>
				{prevCount !== 0 ? <p style={{
					paddingLeft: '12px',
					color: 'grey',
				}}>{`${(diff * 100).toFixed(1)}%`}</p> : <p></p>}
			</div>
		);
	}

	retData.map(coordinate=>(data.push(coordinate.y)));
	let max=parseInt(Math.max.apply(null,data));
	if (parseInt(Math.max.apply(null,data))<3){
		max=3;
	}
	return (
		<div>
			<h3>{formattedTrackedItem}</h3>
			{countEntries(retData, retPastData)}

			{!dataExists && dataExists == false && 
			<Alert variant="filled" severity="info"> No data exists </Alert>}
			<XYPlot yDomain={[0,max]} width={width} height={height} style={{maxWidth: 'inherit'}}
				onMouseLeave={(e) => {
					setHintData(null);
					setPastHintData(null);
				}}
			>
				<HorizontalGridLines />
				<XAxis tickFormat={v => createDateString(v)} tickValues={xAxisVals}/>
				<YAxis tickFormat={val => Math.round(val) === val ? val : ""}/>
				<LineMarkSeries
					curve="curveLinear"
					data={retData}
					onValueMouseOver={ setUpHint }
					style={{fill: 'none'}}
				>
				</LineMarkSeries>
				<LineMarkSeries
					curve="curveLinear"
					strokeStyle="dashed"
					data={retPastData}
					onValueMouseOver={ setUpHintPast }
					style={{fill: 'none'}}
				>
				</LineMarkSeries>
				<LineMarkSeries
					curve="curveLinear"
					data={hiddenLineData}
					style={{display: 'none'}}
				>
				</LineMarkSeries>
				{hintData && <Hint value={hintData}>
					<Paper className='single-client-data-hint'>
						{pastHintData!== null ? <p>{createDateString(pastHintData.getTime())}</p> : <p>{createDateString(hintData.x.getTime())}</p>}
						<p>{descriptor}: {hintData.y}</p>
					</Paper>
				</Hint>}
				{/* {hintData && <Paper className='single-client-data-hint' style={{
					position: 'absolute',
					left: `${hintData.x}px`,
					top: `${hintData.y}px`,
				}}>
					<p>{createDateString(hintData.date.getTime())}</p>
					<p>{descriptor}: {hintData.val}</p>
				</Paper>} */}
				<DiscreteColorLegend items={legendItems} orientation='horizontal' className="single-client-data-legend"/>
			</XYPlot>
		</div>
	)
}

export default function SingleClientData() {
	const [alignment, setAlignment] = React.useState('7days');
	const [selected, setSelected] = useState('Hypervigilance')
	const [retrievedInfo, setRetrievedInfo] = useState(undefined);
	const [width, setWidth] = useState(200);
	const [height, setHeight] = useState(200);
	const userData = useSelector((state) => state.user);
	const clientToUse = useSelector((state) => state.clientToUse);
	let sizingElement = React.createRef();

	useEffect(() => 
	{
		async function getInfo()
		{
			const {data} = await getClientData(clientToUse, auth);
			setRetrievedInfo(data.data);
		}
		getInfo(clientToUse);
	}, []);

	useLayoutEffect(() =>
	{
		function handleResize()
		{
			if (sizingElement && sizingElement.current)
			{
				setWidth(sizingElement.current.offsetWidth * .4)
			}
			else
			{
				setWidth(window.innerWidth*.35)
			}
			setHeight(width*.65);
		}
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, [sizingElement])

	// redirect to / if not logged in
	if (!userData.data) return <Redirect to='/'/>;

	function stringAvatar(name) {
		if (name.indexOf(' ') === -1) {
			return {
				children: `${name}`
			};
		}
		return {
			children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
		};
	}

	const handleAlignment = (event, newAlignment) => {
		setAlignment(newAlignment);
	};

	const handleSelected = (event, newSelected) =>
	{
		setSelected(newSelected);
	}

	const getTrackedSymptoms = (retrievedInfo) =>
	{
		let allReturned = Object.keys(retrievedInfo);
		let pclIndex = allReturned.indexOf('PCL5');
		allReturned.splice(pclIndex, 1);
		let triggerIndex = allReturned.indexOf('Triggers');
		allReturned.splice(triggerIndex, 1);
		let groundingIndex = allReturned.indexOf('GroundingExercises');
		allReturned.splice(groundingIndex, 1);
		let returnVal = [];
		allReturned.forEach((symptomCategory) =>
		{
			let stringVal = symptomCategory.split(/(?=[A-Z])/).join(' ');
			returnVal.push(<ToggleButton value={symptomCategory}>{stringVal}</ToggleButton>);
		});
		return returnVal;
	}

	return (
		<div>
			{!retrievedInfo && <div className="single-client-data-circular-progress"><CircularProgress /></div>}
			{retrievedInfo && <div style={ {padding: '20px'}}>
				<Grid container columnSpacing={2}>
					<Grid item container xs={12} sm={6} md={5} lg={5} xl={5}>
						<Grid item xs={3} sm={4} md={4} lg={3} xl={2}>
							<Avatar style={{ height: '100px', width: '100px' }} {...stringAvatar(clientToUse.name)} alt={clientToUse.name} />
						</Grid>
						<Grid item xs={4} sm={4} md={6} lg={7} xl={8}>
							<Stack spacing={.5} justifyContent="center" alignItems="left">
								<h2>{clientToUse.name}</h2>
								<p>{clientToUse.email}</p>
							</Stack>
						</Grid>
					</Grid>
					<Grid item xs={1} sm={1} md={4} lg={5} xl={5}/>
					<Grid item container xs={4} sm={5} md={3} lg={2} xl={2}>
						<ToggleButtonGroup color="primary" value={alignment} exclusive onChange={handleAlignment}>
							<ToggleButton value="7days">7 Days</ToggleButton>
							<ToggleButton value="1week">Last Week</ToggleButton>
							<ToggleButton value="28days">28 Days</ToggleButton>
						</ToggleButtonGroup>
					</Grid>
				</Grid>
				<br/>
				<Divider variant="middle" sx={{ borderBottomWidth: 3 }}/>
				<Grid container spacing={2} xs={12}>
					<Grid item ref={sizingElement} container spacing={6} xs={12}>
						<Grid item xs={5}>
							<PCL5Chart retrievedInfo={retrievedInfo} width={width} height={height}/>
						</Grid>
						<Grid item xs={5}>
							<BuildPlot plotType='line' retrievedInfo={retrievedInfo} trackedItem={selected} timePeriod={alignment} width={width} height={height} legendTitle={selected=='AvgSymptomsRating' ? 'avg rating' : 'symptom rating'} descriptor="Rating"></BuildPlot>
						</Grid>
						<Grid item xs={2}>
							<ToggleButtonGroup orientation="vertical" exclusive value={selected} onChange={handleSelected}>
								{retrievedInfo ? getTrackedSymptoms(retrievedInfo) : []}
							</ToggleButtonGroup>
						</Grid>
						<Grid item xs={5}>
							<BuildPlot retrievedInfo={retrievedInfo} trackedItem='Triggers' timePeriod={alignment} width={width} height={height} legendTitle="number of triggers" descriptor="Count"></BuildPlot>
						</Grid>
						<Grid item xs={5}>
							<BuildPlot retrievedInfo={retrievedInfo} trackedItem='GroundingExercises' timePeriod={alignment} width={width} height={height} legendTitle="number of exercises" descriptor="Count"></BuildPlot>
						</Grid>
					</Grid>	
					
				</Grid>
			</div>}
		</div>
	);
}
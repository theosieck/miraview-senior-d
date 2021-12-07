import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { auth } from '../../firebase/Firebase';
import { Avatar, Grid } from "@material-ui/core";
import { Button, CircularProgress, Divider, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {XYPlot, AreaSeries, LineSeries, LineMarkSeries, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, Hint, DiscreteColorLegend} from 'react-vis';
import { getClientData } from '../../firebase/Firebase';
import "./SingleClientData.css"
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

const PCL5Chart = (retrievedInfo, width, height) => {
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
		sortedKeys.forEach((sortkey) =>
		{
			let index = retrievedInfo.PCL5[key].findIndex((obj) => new Date(Object.keys(obj)[0]).getTime() === new Date(sortkey).getTime());

			data.push({x: new Date(sortkey), y: Object.values(retrievedInfo.PCL5[key][index])[0]});
		});
		pcl5Obj[key] = data;
	}) : pcl5Obj = {};

	return (
	<div>
	<h3>PCL-5</h3>
	<XYPlot xType="time" stackBy="y" width={width} height={height}>
	<VerticalGridLines />
	<HorizontalGridLines />
	<XAxis tickLabelAngle={-30} tickFormat={v => createDateString(v)}/>
	<YAxis/>
	<AreaSeries
	  className="area-series-example"
	  curve="curveLinear"
	  data={pcl5Obj.Intrusion}
	  color={pcl5Colors.Intrusion}
	/>
	<AreaSeries
	  className="area-series-example"
	  curve="curveLinear"
	  data={pcl5Obj.Avoidance}
	  color={pcl5Colors.Avoidance}
	/>
	<AreaSeries
	  className="area-series-example"
	  curve="curveLinear"
	  data={pcl5Obj.NegativeFeelings}
	  color={pcl5Colors.NegativeFeelings}
	/>
	<AreaSeries
	  className="area-series-example"
	  curve="curveLinear"
	  data={pcl5Obj.Hyperarousal}
	  color={pcl5Colors.Hyperarousal}
	/>
	<DiscreteColorLegend items={legendItems} orientation='horizontal' className="single-client-data-legend single-client-data-legend-pcl5"/>
  </XYPlot>
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
		legendTitle
	} = props;

	let retData = [];
	let retPastData = []
	let formattedTrackedItem;

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

	if (!retrievedInfo) return 'Awaiting data';
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
			//let unsortedPast = info[timePeriod+"PriorPeriod"];
			let sortedKeys = formatData(unsorted);
			//let sortedPastKeys = formatData(unsortedPast)
			sortedKeys.forEach((sortkey)=>
			{
				let index = unsorted.findIndex((obj) => new Date(Object.keys(obj)[0]).getTime() === new Date(sortkey).getTime());
				retData.push({x: new Date(sortkey), y: Object.values(unsorted[index])[0]});
			});
			// sortedPastKeys.forEach((sortkey) =>
			// {
			// 	let index = unsortedPast.findIndex((obj) => new Date(Object.keys(obj)[0]).getTime() === new Date(sortkey).getTime());
			// 	let date = new Date(sortkey);
			// 	date.setDate(date.getDate() + 7);
			// 	retPastData.push({x: date, y: Object.values(unsortedPast[index])[0]});
			// })
			formattedTrackedItem = trackedItem.split(/(?=[A-Z])/).join(' ');
		}
	}

	return (
		<div>
			<h3>{formattedTrackedItem}</h3>
			<XYPlot width={width} height={height} style={{maxWidth: 'inherit'}}>
				<VerticalGridLines />
				<HorizontalGridLines />
				<XAxis tickLabelAngle={-30} tickFormat={v => createDateString(v)}/>
				<YAxis/>
				<LineSeries curve="curveLinear" data={retData} 
				//</XYPlot>onNearestXY={
				//	(datapoint, e) => 
				// {
				// 	console.log(datapoint);
				// 	return <Hint value={datapoint}>
				// 		<div style={{background:'black'}}>
				// 			<p>{datapoint.x}</p>
				// 			<p>{datapoint.y}</p>

				// 		</div>
				// 	</Hint>
				// }
			//} 
				style={{fill: 'none'}}>
				</LineSeries>
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
							<ToggleButton value="24days">24 Days</ToggleButton>
						</ToggleButtonGroup>
					</Grid>
				</Grid>
				<br/>
				<Divider variant="middle" sx={{ borderBottomWidth: 3 }}/>
				<Grid container spacing={2} xs={12}>
					<Grid item ref={sizingElement} container spacing={3} xs={12}>
						<Grid item xs={5}>
							{PCL5Chart(retrievedInfo, width, height)}
						</Grid>
						<Grid item xs={5}>
							<BuildPlot retrievedInfo={retrievedInfo} trackedItem={selected} timePeriod={alignment} width={width} height={height} legendTitle={selected=='AvgSymptomsRating' ? 'avg rating' : 'symptom rating'}></BuildPlot>
						</Grid>
						<Grid item xs={2}>
							<ToggleButtonGroup orientation="vertical" exclusive value={selected} onChange={handleSelected}>
								{retrievedInfo ? getTrackedSymptoms(retrievedInfo) : []}
							</ToggleButtonGroup>
						</Grid>
						<Grid item xs={5}>
							<BuildPlot retrievedInfo={retrievedInfo} trackedItem='Triggers' timePeriod={alignment} width={width} height={height} legendTitle="number of triggers"></BuildPlot>
						</Grid>
						<Grid item xs={5}>
							<BuildPlot retrievedInfo={retrievedInfo} trackedItem='GroundingExercises' timePeriod={alignment} width={width} height={height} legendTitle="number of exercises"></BuildPlot>
						</Grid>
					</Grid>	
					
				</Grid>
			</div>}
		</div>
	);
}
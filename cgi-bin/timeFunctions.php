<?php

// Return "1" if first time is EARLIER then second, "-1" if first is LATER then second, "0" if they are the same time. [Similarly strcmp]
function isFirstEarlierSecond ($hour1, $minute1, $hour2, $minute2) {
	if ($hour1 < $hour2)
		return 1;
	else if ($hour1 > $hour2)
		return -1;
	else if ($hour1 == $hour2) {
		if ($minute1 < $minute2)
			return 1;
		else if ($minute1 > $minute2)
			return -1;
		else if ($minute1 == $minute2)
			return 0;
	}
	else 
		return -2; //wtf
}

// CALL: checkConflict(startTime, stopTime) [Format hh:mm]
// Check if Start is LATER Stop -> Error
// Return "1" if there'is ERROR, "0" if NOT ERROR
function checkTimeConsistence ($start, $stop) {
	$arrStart = explode(":", $start);
	$arrStop = explode(":", $stop);
	$hourStart = $arrStart[0];
	$minuteStart = $arrStart[1];
	$hourStop = $arrStop[0];
	$minuteStop = $arrStop[1];

	// If start is NOT earlier stop -> ERROR
	if (isFirstEarlierSecond ($hourStart, $minuteStart, $hourStop, $minuteStop) != 1)
		return 1;
	else
		return 0;
}

// CALL: checkConflict(storedStart, storedStop, newStart, newStop)
// Return "1" if there'is CONFLICT, "0" if NOT CONFLICT
function checkConflict ($start1, $stop1, $start2, $stop2) {
	$arrStart1 = explode(":", $start1);
	$arrStop1 = explode(":", $stop1);
	$arrStart2 = explode(":", $start2);
	$arrStop2 = explode(":", $stop2);

	$hourStart1 = $arrStart1[0];
	$minuteStart1 = $arrStart1[1];
	$hourStop1 = $arrStop1[0];
	$minuteStop1 = $arrStop1[1];
	$hourStart2 = $arrStart2[0];
	$minuteStart2 = $arrStart2[1];
	$hourStop2 = $arrStop2[0];
	$minuteStop2 = $arrStop2[1];


	// 1° case, New Stop Time is between Stored Start and Stored Stop.
	if ((isFirstEarlierSecond ($hourStart1, $minuteStart1, $hourStop2, $minuteStop2) == 1) &&
		(isFirstEarlierSecond ($hourStop1, $minuteStop1, $hourStop2, $minuteStop2) == -1))
		return 1;
	// 2° case, New Start Time is between Stored Start and Stored Stop.
	else if ((isFirstEarlierSecond ($hourStart1, $minuteStart1, $hourStart2, $minuteStart2) == 1) && 
			(isFirstEarlierSecond ($hourStop1, $minuteStop1, $hourStart2, $minuteStart2) == -1))
		return 1;
	// 3° case, Violate both 2 above rules.
	// 4° case, New Start is the same of Stored Start - 5° case, New Stop is the same of Stored Stop
	else if ((isFirstEarlierSecond ($hourStart1, $minuteStart1, $hourStart2, $minuteStart2) == 0) || 
			(isFirstEarlierSecond ($hourStop1, $minuteStop1, $hourStop2, $minuteStop2) == 0))
		return 1;
	// NO CONFLICT IN OTHER CASES
	else return 0;
}

/*

1)
STORED: ....................10.30..................12.00.............
NEW:	.............9.00.............11.00.........................

2)
STORED: ....................10.30..................12.00..............
NEW:	...............................11.00..............13.00......

3)
STORED: ....................10.30..................12.00..............
NEW:	............................11.00..11.30......................

4)
STORED: ....................10.30.......................()..............
NEW:	....................10.30........................().............

5)
STORED: ....................()........................12.00..............
NEW:	.....................().......................12.00..............

*/



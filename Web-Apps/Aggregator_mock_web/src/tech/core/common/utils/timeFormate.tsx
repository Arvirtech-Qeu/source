import React from 'react';

function FormattedDate({ timestamp }:any) {
  // Convert the timestamp to a Date object
  const date = new Date(timestamp);

  // Format the date using toLocaleString()
  const formattedDate = date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true // to display in 12-hour format
  });

  return <span>{formattedDate}</span>;
}

export default FormattedDate;

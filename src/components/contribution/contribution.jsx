import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Contribution = () => {
    const [contr, setContr] = useState([]);
    const [hoveredDate, setHoveredDate] = useState(null);
    const [contributionsCount, setContributionsCount] = useState(0);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        axios
            .get('https://dpg.gg/test/calendar.json')
            .then((res) => {
                const responseData = res.data;
                console.log(responseData);
                setContr(responseData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const numRows = 7;
    const numCols = 51;
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getStartingMonth = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        return new Date(currentYear, currentMonth, 1);
    };

    const handleCellHover = (dateString, event) => {
        setHoveredDate(dateString);
        setContributionsCount(contr[dateString] || 0);
        setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    const renderGrid = () => {
        const grid = [];
        const startingMonth = getStartingMonth();
        let currentMonth = new Date(startingMonth);

        for (let month = 0; month < 1; month++) {
            for (let row = 0; row < numRows; row++) {
                const rowItems = [];
                for (let col = 0; col < numCols; col++) {
                    const date = new Date(currentMonth);
                    date.setDate(date.getDate() - (7 * col + row));
                    const dateString = date.toISOString().split('T')[0];
                    const contributionValue = contr[dateString] || 0;

                    let backgroundColor;
                    if (contributionValue >= 0 && contributionValue <= 1) {
                        backgroundColor = '#EDEDED';
                    } else if (contributionValue >= 1 && contributionValue <= 9) {
                        backgroundColor = '#ACD5F2';
                    } else if (contributionValue >= 10 && contributionValue <= 19) {
                        backgroundColor = '#7FA8C9';
                    } else if (contributionValue >= 20 && contributionValue <= 29) {
                        backgroundColor = '#527BA0';
                    } else if (contributionValue >= 30 && contributionValue <= 50) {
                        backgroundColor = '#254E77';
                    }

                    rowItems.push(
                        <div
                            className='contribution__div'
                            key={`cell-${month}-${row}-${col}`}
                            style={{ backgroundColor }}
                            onMouseEnter={(event) => handleCellHover(dateString, event)}
                            onMouseLeave={() => {
                                setHoveredDate(null);
                                setContributionsCount(0);
                                setCursorPosition({ x: 0, y: 0 });
                            }}
                        ></div>
                    );
                }
                grid.push(
                    <div key={`row-${month}-${row}`} style={{ display: 'flex' }}>
                        {rowItems}
                    </div>
                );
            }

            // Move to the next month
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }
        return grid;
    };

    const getDayOfWeek = (dateString) => {
        const date = new Date(dateString);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        return dayOfWeek;
    };

    return (
        <div className='contribution '>
            <ul className="contribution__list">
                {[...Array(12)].map((_, index) => {
                    const currentMonth = new Date(getStartingMonth());
                    currentMonth.setMonth(currentMonth.getMonth() + index);
                    return (
                        <li key={index}>
                            {currentMonth.toLocaleDateString('en-US', { month: 'short' })}
                        </li>
                    );
                })}
            </ul>
            <div className='contribution__row'>
                <ul>
                    {weekDays.map((day, index) => (
                        <li key={index}>{day}</li>
                    ))}
                </ul>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {renderGrid()}
                </div>
            </div>
            {hoveredDate && (
                <div
                    className='contribution__hovered-date'
                    style={{ left: cursorPosition.x, top: cursorPosition.y }}
                >
                    <h1>({contributionsCount} contributions)</h1>
                    <p>{getDayOfWeek(hoveredDate)} {hoveredDate}  </p>

                </div>
            )}
        </div>
    );
};

export default Contribution;
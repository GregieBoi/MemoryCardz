import React from 'react';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const defaultRatings = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export function StarChart(props) {
    const { ratings } = props;
    const safeRatings = (ratings || defaultRatings).slice(1, 11);
    const maxValue = safeRatings.reduce((acc, value) => {
        return Math.max(acc, value);
    }, 0) || 1;


    const numStars = safeRatings.reduce((acc, value, index) => {
        return acc + (value * (index + 1));
    }, 0);
    const numRatings = safeRatings.reduce((acc, value) => {
        return acc + value;
    }, 0) || 1;
    const avgRating = numStars / numRatings;
    return (
        <div>
            <p className="mt-3 pt-3" id="favorites">RATINGS</p>
        <div style={{ height: 100, width: 300, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent:'center'}}>
            <FontAwesomeIcon icon={faStar} style={{ color: '#DD2020' }} />
            {safeRatings.map((value, index) => {
                return (
                    <div key={`${index}`} style={{ position: 'relative', flex: 1, height: `${Math.max(((value / maxValue) * 100), 2)}%` }}>
                        <div style={{ position: 'absolute', left: 1, top: 0, right: 1, bottom: 0, backgroundColor: 'red' }}></div>
                    </div>
                )
            })}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems:'center' }}>
                <h2>{(avgRating / 2).toFixed(2)}</h2>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <FontAwesomeIcon icon={faStar} style={{ color: '#DD2020' }} />
                    <FontAwesomeIcon icon={faStar} style={{ color: '#DD2020' }} />
                    <FontAwesomeIcon icon={faStar} style={{ color: '#DD2020' }} />
                    <FontAwesomeIcon icon={faStar} style={{ color: '#DD2020' }} />
                    <FontAwesomeIcon icon={faStar} style={{ color: '#DD2020' }} />
                </div>
            </div>
        </div>
        </div>
    );
}
import React from 'react';
import styled from '@emotion/styled';

type DateBadgeProps = {
  date: string | Date;
};

const Badge = styled.span`
  background-color: #2c2c2c;
  color: #e0e0e0;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  font-family: 'Segoe UI', sans-serif;
  display: inline-block;
  min-width: 50px;
  text-align: center;
`;

export const DateBadge: React.FC<DateBadgeProps> = ({ date }) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('default', { month: 'short' });

  return <Badge>{`${day} ${month}`}</Badge>;
};

import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

interface TableCardProps {
  tableNo: number;
  interval: number;
}

const Container = styled.div<{ remainingTime: number; interval: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;
  background: ${(props) => {
    if (props.remainingTime > (props.interval / 3) * 2) return 'green';
    else if (props.remainingTime > props.interval / 3) return 'yellow';
    else if (props.remainingTime > 0) return 'red';
    else return 'lightgray';
  }};
`;

function TableCard({ tableNo, interval }: TableCardProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [tableInterval] = useState<number>(interval);
  const [intervalIds, setIntervalIds] = useState<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const savedStartDate = localStorage.getItem(`table_${tableNo}_StartDate`);

    if (!savedStartDate) return;
    setStartDate(new Date(savedStartDate));
    setEndDate(new Date(new Date(savedStartDate).getTime() + tableInterval * 60000));

    setIntervalIds([
      ...intervalIds,
      setInterval(() => {
        const end = new Date(new Date(savedStartDate).getTime() + tableInterval * 60000);
        const now = new Date();
        const diff = end.getTime() - now.getTime();

        setRemainingTime(diff);
      }, 1000),
    ]);
  }, []);

  const startTableTimer = () => {
    const start = new Date();
    setStartDate(start);
    setEndDate(new Date(new Date().getTime() + 60000 * tableInterval));
    localStorage.setItem(`table_${tableNo}_StartDate`, new Date().toISOString());
    setIntervalIds([
      ...intervalIds,
      setInterval(() => {
        const end = new Date(start.getTime() + tableInterval * 60000);
        const now = new Date();
        const diff = end.getTime() - now.getTime();

        setRemainingTime(diff);
      }, 1000),
    ]);
  };

  const endTableTimer = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    localStorage.removeItem(`table_${tableNo}_StartDate`);
    setRemainingTime(0);
    console.log(intervalIds);
    intervalIds.forEach((intervalId) => clearInterval(intervalId));
    setIntervalIds([]);
  };

  if (!startDate || !endDate)
    return (
      <Container remainingTime={remainingTime / 60000} interval={tableInterval}>
        <div>테이블 {tableNo}번</div>
        <div>사용중이 아닙니다.</div>
        <button onClick={startTableTimer}>테이블 사용 시작</button>
      </Container>
    );

  return (
    <Container remainingTime={remainingTime / 60000} interval={tableInterval}>
      <div>테이블 {tableNo}번</div>
      <div>시작 시간: {startDate.toLocaleTimeString()}</div>
      <div>종료 시간: {endDate.toLocaleTimeString()}</div>
      {remainingTime <= 0 && <div>시간 종료</div>}
      {remainingTime > 0 && (
        <div>
          남은 시간: {Math.floor(remainingTime / 60000)}분 {Math.floor((remainingTime % 60000) / 1000)}초
        </div>
      )}
      <button onClick={endTableTimer}>테이블 사용 종료</button>
    </Container>
  );
}

export default TableCard;

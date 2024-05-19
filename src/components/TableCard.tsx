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

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

function TableCard({ tableNo, interval }: TableCardProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const tableInterval = startDate && endDate ? (endDate.getTime() - startDate.getTime()) / 60000 : interval;
  const [intervalIds, setIntervalIds] = useState<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const savedStartDate = localStorage.getItem(`table_${tableNo}_StartDate`);
    const savedEndDate = localStorage.getItem(`table_${tableNo}_EndDate`);

    if (!savedStartDate || !savedEndDate) return;
    setStartDate(new Date(savedStartDate));
    setEndDate(new Date(savedEndDate));

    setIntervalIds([
      ...intervalIds,
      setInterval(() => {
        const end = new Date(savedEndDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();

        setRemainingTime(diff);
      }, 1000),
    ]);
  }, []);

  const startTableTimer = () => {
    const start = new Date();
    const end = new Date(start.getTime() + 60000 * tableInterval);

    setStartDate(start);
    setEndDate(end);

    localStorage.setItem(`table_${tableNo}_StartDate`, start.toISOString());
    localStorage.setItem(`table_${tableNo}_EndDate`, end.toISOString());

    setIntervalIds([
      ...intervalIds,
      setInterval(() => {
        const now = new Date();
        const diff = end.getTime() - now.getTime();

        setRemainingTime(diff);
      }, 1000),
    ]);
  };

  const endTableTimer = () => {
    const input = confirm('테이블 사용을 종료하시겠습니까?');
    if (!input) return;

    setStartDate(undefined);
    setEndDate(undefined);
    localStorage.removeItem(`table_${tableNo}_StartDate`);
    localStorage.removeItem(`table_${tableNo}_EndDate`);
    setRemainingTime(0);
    console.log(intervalIds);
    intervalIds.forEach((intervalId) => clearInterval(intervalId));
    setIntervalIds([]);
  };

  const chargeTable = () => {
    if (!endDate) return;

    const end = new Date(endDate.getTime() + 60000 * 30);
    setEndDate(end);
    localStorage.setItem(`table_${tableNo}_EndDate`, end.toISOString());

    intervalIds.forEach((intervalId) => clearInterval(intervalId));
    setIntervalIds([
      setInterval(() => {
        const now = new Date();
        const diff = end.getTime() - now.getTime();

        setRemainingTime(diff);
      }, 1000),
    ]);
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
      <ButtonContainer>
        <button onClick={chargeTable}>테이블 30분 연장</button>
        <button onClick={endTableTimer}>테이블 사용 종료</button>
      </ButtonContainer>
    </Container>
  );
}

export default TableCard;

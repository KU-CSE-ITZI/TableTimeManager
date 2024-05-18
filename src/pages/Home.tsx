import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import TableCard from '../components/TableCard';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 100vw;
  max-width: 500px;
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
`;

function Home() {
  const [tableCount, setTableCount] = useState<number>(0);
  const [tableInterval, setTableInterval] = useState<number>(0);
  const navigate = useNavigate();

  const deleteAllIntervals = () => {
    const intervalIds = window.setInterval(function () {}, Number.MAX_SAFE_INTEGER);

    for (let i = 1; i < intervalIds; i++) {
      window.clearInterval(i);
    }
  };

  useEffect(() => {
    deleteAllIntervals();

    const savedTableCount = localStorage.getItem('tableCount');
    const savedTableInterval = localStorage.getItem('tableInterval');
    if (!savedTableCount) return;
    setTableCount(Number(savedTableCount));
    setTableInterval(Number(savedTableInterval));
  }, []);

  const handleTableCountChange = (count: number) => {
    setTableCount(count);
    localStorage.setItem('tableCount', count.toString());
  };

  return (
    <Container>
      <div>
        <div>테이블 수: {tableCount}</div>
        <div>좌석 할당 시간: {tableInterval}분</div>
      </div>
      <button onClick={() => navigate('/time')}>좌석 시간 관리</button>
      <button onClick={() => handleTableCountChange(tableCount + 1)}>테이블 추가</button>
      <button onClick={() => handleTableCountChange(tableCount - 1)}>테이블 삭제</button>
      {Array.from({ length: tableCount }, (_, index) => (
        <TableCard tableNo={index + 1} interval={tableInterval} key={index} />
      ))}
    </Container>
  );
}

export default Home;

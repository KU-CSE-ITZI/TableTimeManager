import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Time() {
  const [tableInterval, setTableInterval] = useState<number>(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTableInterval = localStorage.getItem('tableInterval');
    if (!savedTableInterval) return;

    setTableInterval(Number(savedTableInterval));
  }, []);

  const handleTableIntervalChange = () => {
    const newInterval = Number(inputRef.current?.value);
    localStorage.setItem('tableInterval', newInterval.toString());
    navigate('/');
  };

  return (
    <div>
      <h1>좌석 시간 관리</h1>
      <h2>현재 좌석 할당 시간은 {tableInterval}분 입니다.</h2>
      <h2>분 단위로 적어주세요</h2>
      <input ref={inputRef} />
      <button onClick={handleTableIntervalChange}>변경</button>
    </div>
  );
}

export default Time;

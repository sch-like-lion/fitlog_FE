export default function Character({ data }) {
  if (!data) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    }}>
      <img 
        src="/character.png"
        alt="Character" 
        style={{ width: '400px', height: '400px', objectFit: 'contain' }} 
      />
      <div style={{
        fontSize: '16px',
        color: '#666',
        fontWeight: '600'
      }}>
        전체 {data.overallRank}등 • 총점 {data.totalScore}점
      </div>
    </div>
  );
}
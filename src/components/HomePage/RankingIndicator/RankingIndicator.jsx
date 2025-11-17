export default function RankingIndicator() {
  // 사용자 티어 정보 (실제로는 props나 API에서 가져올 데이터)
  const userTier = {
    name: '골드',
    percentage: 30,
    image: '🥇', // 실제로는 이미지 URL을 사용
    color: '#FFD700'
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '2px solid #f0f0f0',
      maxWidth: '300px'
    }}>
      {/* 티어 사진 */}
      <div style={{
        fontSize: '32px',
        marginRight: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: `${userTier.color}20`
      }}>
        {userTier.image}
      </div>
      
      {/* 티어 정보 */}
      <div style={{ flex: 1 , display: 'flex', flexDirection: 'row', gap:'8px' }}>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: userTier.color,
        }}>
          {userTier.name}
        </div>
        <div style={{
          fontSize: '14px',
          color: '#666',
          fontWeight: '500',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
        }}>
          상위 {userTier.percentage}%
        </div>
      </div>
    </div>
  );
}
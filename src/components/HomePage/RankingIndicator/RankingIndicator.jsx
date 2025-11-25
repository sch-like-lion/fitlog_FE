export default function RankingIndicator({ data }) {
  if (!data) return null;

  // 티어별 색상 매핑
  const tierColors = {
    '브론즈': '#CD7F32',
    '실버': '#C0C0C0',
    '골드': '#FFD700',
    '플래': '#E5E4E2',
    '다이아': '#B9F2FF',
  };

  const userTier = {
    name: data.tierName,
    image: data.tierImageUrl,
    color: tierColors[data.tierName] || '#999999'
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
        marginRight: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: `${userTier.color}20`
      }}>
        <img 
          src={userTier.image} 
          alt={userTier.name}
          style={{ width: '40px', height: '40px', objectFit: 'contain' }}
        />
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
          티어 내 {data.rankInTier}등
        </div>
      </div>
    </div>
  );
}
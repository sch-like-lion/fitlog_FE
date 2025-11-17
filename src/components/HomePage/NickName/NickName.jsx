export default function NickName() {
  // 사용자 닉네임 정보 (실제로는 props나 API에서 가져올 데이터)
  const userNickName = "헬스왕";

  return (
    <div style={{
      padding: '10px 20px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '2px solid #f0f0f0',
      maxWidth: '300px',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center'
    }}>
      {userNickName}님 환영합니다!
    </div>
  );
}
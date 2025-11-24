import "./globals.css";  // 전체 앱에 적용되는 CSS

export default function RootLayout({ children }) {
  console.log('app 의 layout');
  return (
    <html lang="en" className="tc-new-price">
      <head>
        <link 
          href="https://fonts.googleapis.com/icon?family=Material+Icons" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* <body> */}
        {children}
      </body>
    </html>
  );
}
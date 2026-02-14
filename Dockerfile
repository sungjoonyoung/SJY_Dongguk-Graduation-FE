# 1. 최신 LTS 버전인 Node.js 22버전의 가벼운 이미지를 사용합니다.
FROM node:22-alpine

# 2. 컨테이너 내부 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# 3. pnpm을 사용하기 위해 전역으로 pnpm을 설치합니다.
RUN npm install -g pnpm

# 4. 의존성 설치를 위해 패키지 목록 파일들을 먼저 복사합니다.
COPY package.json pnpm-lock.yaml* ./

# 5. 라이브러리를 설치합니다.
RUN pnpm install

# 6. 나머지 프론트엔드 소스 코드를 모두 복사합니다.
COPY . .

# 7. Vite 개발 서버를 실행합니다.
# --host 옵션은 도커 외부(우리 맥북)에서 접속할 수 있게 허용하는 필수 옵션입니다.
CMD ["pnpm", "dev", "--host"]
# nestjs-instagram-clone

- 인스타 웹 페이지를 기반으로 만든 클론 사이트
- react-instagram-clone2과 연동

> https://github.com/cdis001/react-instagram-clone2

## 1. 기술 스택

1. 라이브러리/프레임워크

   - nestJS
     - 전체 프로젝트를 관리하는 프레임워크로 사용
     - express보다 구조화된 프레임워크이므로 아키텍쳐가 정의되어 있어 구조를 짜는 노력이 줄어듦

2. 데이터

- PostgreSQL
  - 이전에 공부했던 mysql과 크게 다르지 않으면서 더욱 다양한 기능을 제공
- Docker
  - DB 관련 설정을 매번 다른 환경에 적용하기 귀찮아서 사용
  - 명령어 하나로 다른 환경에서도 프로젝트를 실행하기 편리했음
- TypeORM
  - 완벽하진 않지만 TypeScript를 사용할 예정이므로 nestJS와의 호환이 좋은 ORM 선택
  - SQL문을 사용해서 데이터를 가져올 수도 있고, 내장 함수로도 가져올 수 있음.
  - 개인적으로 SQL을 많이 다뤄보지 않아 내장 함수로 가져오는 방식 선택

## 2. 실행 방법

1. nestjs-instagram-clone 저장소에서 소스를 clone한다
2. nestjs-instagram-clone 프로젝트의 도커 설치 및 실행
3. nestjs-instagram-clone 프로젝트 폴더에서 npm install 명령어 실행
4. npm 설치 완료 후, npm start run 명령어 실행
5. react-instagram-clone2 저장소에서 소스를 clone한다
6. react-instagram-clone2 프로젝트 폴더에서 yarn install 명령어 실행
7. 라이브러리 설치 완료 후 yarn start 명령어 실행

## 3. 주요 기능

1. Auth

   - 로그인
   - 회원가입

2. Feed

   - 피드 추가
   - 피드 읽어오기
   - 피드 삭제

3. Follow

   - 팔로우 기능 추가
   - 팔로워들 모아서 볼 수 있는 기능 추가
   - 메인페이지에서는 팔로워들의 게시글만 볼 수 있게끔 구현

4. Comment

   - 댓글 추가
   - 댓글 삭제
   - 댓글 읽어오기

5. Like
   - 피드에 좋아요 누를 수 있는 기능 추가
   - 댓글에 좋아요 누를 수 있는 기능 추가
   - 피드에 좋아요를 누른 사람들의 수를 보여주는 기능 추가

## 4. 추가 예정 기능

- [ ] 피드 무한스크롤
- [ ] DM 기능 추가
- [ ] 서버에 transaction 적용
- [ ] 유저 정보 가져올 때 id만 가져오게끔 수정
- [ ] Refresh Token 추가

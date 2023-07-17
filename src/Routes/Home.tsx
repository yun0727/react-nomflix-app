import {useQuery} from "react-query"
import styled from "styled-components";
import { makeImagePath } from "../utils";
import Sliders from "./Components/Slider";
import { IGetDataResult, LIST_TYPE, getNowPlayingMovies, getUpcomingMovies } from "../api";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Banner = styled.div<{bgPhoto:string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,1)) , url(${props => props.bgPhoto});
  background-size: cover;
`
const Title = styled.h2`
  font-size: 68px;
  margin-top: 80px;
  margin-bottom: 20px; 
`
const Overview = styled.p`
  font-size: 28px;
  width: 50%; 
`
const SliderArea = styled.div`
  position: relative;
  margin-top: -16.8rem;
  @media screen and (max-width: 700px) {
    margin-top: -8.8rem;
  }
`;

function Home(){
  // nowplaying
  const { data: nowPlayingMoviesList, isLoading } = useQuery<IGetDataResult>(
    [LIST_TYPE[0], "nowPlayingMovies"],
    getNowPlayingMovies
  );
  // upcoming
  const { data: upcomingMoviesList } = useQuery<IGetDataResult>(
    [LIST_TYPE[1], "upcomingMovies"],
    getUpcomingMovies
  );

  return (
    <Wrapper>
    {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
        <Banner 
          bgPhoto={makeImagePath(nowPlayingMoviesList?.results[0].backdrop_path || "")}
          >
          <Title>{nowPlayingMoviesList?.results[0].title}</Title>
          <Overview>{nowPlayingMoviesList?.results[0].overview}</Overview>
        </Banner>
        <SliderArea>
            <Sliders
              data={nowPlayingMoviesList as IGetDataResult}
              title={"NOW PLAYING"}
              listType={LIST_TYPE[0]}
              mediaType={"movie"}
              menuName={"home"}
            />
            <Sliders
              data={upcomingMoviesList as IGetDataResult}
              title={"UPCOMING MOVIES"}
              listType={LIST_TYPE[1]}
              mediaType={"movie"}
              menuName={"home"}
            />


        </SliderArea>

        </>
        )}
    </Wrapper>
  )
}

export default Home
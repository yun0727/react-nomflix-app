import { useHistory, useRouteMatch } from "react-router-dom";
import { IGetDataResult } from "../../api";
import { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { makeImagePath } from "../../utils";

const Wrapper = styled(motion.div)`
position: relative;
min-height: 23.9rem;
margin-top: 3rem;
`
const Title = styled.h2`
font-size: 30px;
margin-bottom: 20px; 
`
const Row = styled(motion.div)`
display: grid;
gap: 5px;
grid-template-columns: repeat(6, 1fr);
position: absolute;
width: 100%;
`
const Box = styled(motion.div)<{ bgphoto: string; offset: number }>`
background-color: white;
background-image: url(${(props)=> props.bgphoto});
background-size: cover;
background-position: center center;
height: 200px;
font-size: 66px;
cursor: pointer;
&:first-child{
  transform-origin: center left;
}
&:last-child{
  transform-origin: center right;
}
`;
const Info = styled(motion.div)`
padding: 10px;
background-color: ${(props)=> props.theme.black.lighter};
opacity: 0;
position: absolute;
width: 100%;
bottom: 0;
h4{
  text-align: center;
  font-size: 18px;
}
`;


const rowVariants = {
  hidden:{
    x: window.outerWidth + 5,
  },
  visible:{
    x:0
  },
  exit:{
    x: -window.outerWidth -5,
  }
}
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      type: "tween",
      delay: 0.3,
      duration: 0.2,
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.3,
    },
  },
};

interface ISlider{
  data: IGetDataResult;
  title: string;
  listType: string;
  menuName: string;
  mediaType: string;
}

export default function Sliders({
  data,
  title,
  listType,
  menuName,
  mediaType
}: ISlider){
  const history = useHistory();
  const offset = 6;
  const [isRight, setIsRight] = useState(0);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = (value: boolean)=> {
    setLeaving(value);
  }
  const onBoxClicked=(menu: string, type: string, id: number)=>{
    history.push(`/${menu}/${type}/${id}`)
  }
  const increaseIndex = () => {
    if (data){
      if (leaving) return;
      toggleLeaving(false);
      const totalMovies = data.results.length -1;
      const maxIndex = Math.floor(totalMovies / offset) -1;
      setIndex((prev)=> (prev === maxIndex ? 0 : prev +1));
    }
  };
  const rowProps = {
    gridcnt: offset,
    custom: isRight,
    variants: rowVariants,
    initial: "hidden",
    animate:"visible",
    exit:"exit",
    transition: {type:"tween", duration:1},
    key: index,
  }
  
  return(
    <Wrapper >
      <Title onClick={increaseIndex} >{title}</Title>
      <AnimatePresence
        initial={false}
        onExitComplete={()=> toggleLeaving(false)}
        custom={isRight}
      >
        <Row
          {...rowProps}
          >
          {data?.results
            .slice(offset*index, offset *index + offset)
            .map((movie)=>(
              <Box
                key={movie.id}
                variants={boxVariants}
                initial="normal"
                whileHover={"hover"}
                transition={{type: "tween"}}
                layoutId={movie.id+""+listType}
                bgphoto={makeImagePath(movie.backdrop_path || "", "w500")}
                offset={offset}
                onClick={()=> onBoxClicked(menuName, listType, movie.id)}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>

    </Wrapper>
  )



}


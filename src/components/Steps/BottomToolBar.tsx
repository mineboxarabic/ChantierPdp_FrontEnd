import { Button } from "@mui/material";
import { HorizontalBox } from "../Layout/Layouts";
import {useEffect, useState} from "react";
const StepCircle = ({active}) => {
    return(
        <div
            style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: active ? 'blue' : 'grey'
            }}
        />
    );
}
const BottomToolBar = ({pageNumber, setPageNumber, maxNumber}) => {

    //From 1 to maxNumber
    const [pageNumberArray, setPageNumberArray] = useState<number[]>([]);

    useEffect(() => {
//        setPageNumberArray(Array.from({length: maxNumber}, (_, i) => i + 1))

        const array :number[]= [];
        for(let i = 1; i <= maxNumber; i++){
            array.push(i);
        }
        setPageNumberArray(array);
    }, [maxNumber]);

    useEffect(() => {
        if(pageNumber > maxNumber){
            setPageNumber(maxNumber)
        }
    }, [pageNumber]);


    return(
        <>

                <HorizontalBox
                    display={"flex"}
                    flexDirection={"row"}
                    gap={"16px"}
                    width={"100%"}
                    justifyContent={"space-between"}
                    padding={"16px"}
                    alignItems={"center"}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                        //    window.location.href = "step" + (pageNumber - 1);

                            if(pageNumber > 1){
                                setPageNumber(pageNumber - 1)
                            }
                        }}
                    >
                        Précédent
                    </Button>
                    <HorizontalBox
                        display={"flex"}
                        flexDirection={"row"}
                        gap={"16px"}
                        >

                        {
                            pageNumberArray.map((item) => {
                                return(
                                    <StepCircle key={item} active={item === pageNumber}/>
                                )
                            })
                        }
                    </HorizontalBox>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            if(pageNumber < maxNumber){
                                setPageNumber(pageNumber + 1)

                            }

                           // window.location.href = "step" + (pageNumber + 1);
                        }}
                    >
                        Suivant
                    </Button>

                    {
                        pageNumber === maxNumber && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                         //           window.location.href = "step" + (pageNumber + 1);

                                }}
                            >
                                Terminer
                            </Button>
                        )
                    }
                </HorizontalBox>

        </>
    );
}

export default BottomToolBar;
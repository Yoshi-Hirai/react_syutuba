import { Button, Box, ChakraProvider, Flex, Input, Text } from '@chakra-ui/react'
import './App.css'
import { useState } from 'react'
import {useFormik} from 'formik'

type HorseInformation = {
  id: number
  horsename: string
  stallionname: string
  bnsname: string
  jockeyname: string
  optimal: boolean
}

type RaceInformation = {
  id: number
  racetext: string
  horsedata: HorseInformation[]
}

function App() {
  const [racedata, setRaceData] = useState<RaceInformation[]>([])

  const formik = useFormik({
    initialValues: {
      action: "Program",
      raceid: "",
    },
    onSubmit: (val) => {
      console.log("Get Value.", val)
      getRecords()

      async function getRecords() {

        console.log(JSON.stringify(val))
        const response = await fetch('https://rclq34cwwwqkapnkvyefjsjztm0ymsfb.lambda-url.us-east-1.on.aws/',
          { // クロスオリジン対応
            mode: "cors",  // クロスオリジンリクエストであることを指定
            // クロスオリジン対応(ここまで)
            method: "POST",
            body: JSON.stringify(val)
          }
        )
        const data = await response.json()
        console.log(data)
        setRaceData(data.racedata)
      }
    }
  })
/*
  const handlerActionChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("action", event.target.value)
  }
*/

  return (
    <ChakraProvider>
      <div>
        <Text fontSize='4xl'>JRA Entries Check</Text>
        <Text>yyyy[開催場所][開催回][開催日]</Text>
        <Text>01 札幌 02 函館 03 福島 04 新潟 05 東京 06 中山 07 中京 08 京都 09 阪神 10 小倉</Text>
        <Box mb="16px">
          <form action="" onSubmit={formik.handleSubmit}>
              <div>
                <Input placeholder='Input RaceMeeting' mb="4px"
                  type="text" 
                  id="raceid" 
                  name="raceid" 
                  value={formik.values.raceid} 
                  onChange={formik.handleChange}
                />
              </div>
            <Button colorScheme='blue' variant='solid' type="submit">Search</Button>
          </form>
        </Box>
        {racedata.length > 0 &&
          <div>
            {racedata.map((data) => (
              <div key="data.id">
              <Box mb="32px">
                <Text fontSize='xl'>{data.racetext}</Text>
                {data.horsedata.map((h) => (
                  <Flex align="center" justifyContent="space-between">
                    <Box>
                      <Text>{h.id}</Text>
                    </Box>
                    <Box bg={h.optimal ? "tomato" : "skyblue"}>
                      <Text fontWeight={h.optimal ? "bold" : "normal"}>{h.horsename}</Text>
                    </Box>
                    <Box>
                      <Text>{h.stallionname}</Text>
                    </Box>
                    <Box>
                      <Text>{h.bnsname}</Text>
                    </Box>
                    <Box>
                      <Text>{h.jockeyname}</Text>
                    </Box>
                  </Flex>
                ))}
              </Box>
              </div>
            ))}
          </div>
        }        
      </div>
    </ChakraProvider>
  )
}

export default App

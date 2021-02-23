import React, { useState } from "react"
import { Formik, Form, Field } from 'formik'
import { 
  ChakraProvider,
  Container,
  Box,
  Input,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Button,
  useDisclosure,
  Link,
  Flex,
  Img
} from "@chakra-ui/react"

// logo 组件
function LogoImage() {
  return (
    <Box
      h="92px"
      w="272px"
      backgroundImage="url('/images/google_logo.svg')"
      m="145px auto 38px"
    ></Box>
  )
}

// 搜索框组件
function SeachInput() {
  return (
    <Box w="100%" h="44px" position="relative" mb="32px">
      <Box
        position="absolute"
        left="15px"
        top="12px"
        width="24px"
        height="24px"
        backgroundImage="url(/images/search.svg)"
      ></Box>
      <Input
        w="100%"
        h="100%"
        px="50px"
        outline="none"
        color="#000001"
        fontcolor="#000"
        borderRadius="30px"
        boxShadow="0px 0px 5px #d9d9d9"
        border="1px solid #000"
        _focus={{
          outline: "none"
        }}
        placeholder="在 Google 上搜索，或者输入一个网址" />
        <Box
        position="absolute"
        right="15px"
        top="12px"
        width="24px"
        height="24px"
        backgroundImage="url(/images/googlemic_clr_24px.svg)"
      ></Box>
    </Box>
  )
}

function Shortcut () {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = React.useRef()

  function validateWebname(value) {
    let error;
    if (!value) {
      error = '请填写名称！';
    }
    return error;
  }

  function validateWeburl(value) {
    let error;
    if (!value) {
      error = '请填写网址！';
    } else if (!/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/i.test(value)) {
      error = "请输入有效的网址！"
    }
    return error;
  }

  //判断图片是否存在
  function CheckImgExists(imgurl) {
    return new Promise(function(resolve, reject) {
      var ImgObj = new Image();
      ImgObj.src = imgurl
      ImgObj.onload = function(res) {
        resolve(res)
      }
      ImgObj.onerror = function(err) {
        reject(err)
      }
    })
  }

  const [short, setShort] = useState([])

  return (
    <>
      <Flex w="573px" flexWrap="wrap" overflow="hidden">
        {short.map(item => (
          <Link href={item.weburl} key={item.id}>
            <Box
              d="inline-block"
              p="13px 11px 4px"
              mt="4px"
              mb="13px"
              cursor="pointer"
              _hover={{ backgroundColor: "#2021241a", borderRadius: "5px"}}
            >
              <Flex
                w="48px"
                h="48px"
                m="0px auto 15px"
                backgroundColor="#f1f3f4"
                borderRadius="50%"
                align="center"
                justify="center"
              > 
                <Img w="24px" h="24px" src={item.img} />
              </Flex>
              <Text textAlign="center" w="88px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" fontSize="13px" mb="13px">{item.webname}</Text>
            </Box>
          </Link>
        ))}
        <Box
          d="inline-block"
          p="13px 11px 4px"
          mt="4px"
          mb="13px"
          cursor="pointer"
          _hover={{ backgroundColor: "#2021241a", borderRadius: "5px"}}
          onClick={onOpen}
        >
          <Box
            w="48px"
            h="48px"
            m="0px auto 15px"
            backgroundColor="#f1f3f4"
            borderRadius="50%"
            backgroundImage="url(/images/add.svg)"
            backgroundRepeat="no-repeat"
            backgroundPosition="center"
          ></Box>
          <Text textAlign="center" w="88px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" fontSize="13px" mb="13px">添加快捷方式</Text>
        </Box>
      </Flex>

      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="16px" fontWeight="none" color="#333">添加快捷方式</ModalHeader>
          <Formik
            initialValues={{
              webname: '',
              weburl: '',
            }}
            onSubmit={values => {
              const webname = values.webname
              const weburl = values.weburl
              const website = weburl.match(/^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+/g)
              const logo = website + '/favicon.ico'
              CheckImgExists(logo).then(() => {
                const resultShort = short.concat([{
                  id: Math.ceil(Math.random()*100),
                  webname: webname,
                  weburl: weburl,
                  img: logo
                }])
                setShort(resultShort)
              })
            }}
          >
            {({errors, touched }) => (
              <Form>
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel fontSize="14px"  color="#666">名称</FormLabel>
                    <Field
                      as={Input}
                      bgColor="#f1f3f4"
                      borderRadius="2px"
                      p="10px"
                      variant="flushed"
                      name="webname"
                      validate={validateWebname}
                    />
                    {errors.webname && touched.webname && <Text fontSize="12px" color="#ea6f5a" mt="5px">{errors.webname}</Text>}
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel fontSize="14px" color="#666">网址</FormLabel>
                    <Field
                      as={Input}
                      bgColor="#f1f3f4"
                      borderRadius="2px"
                      p="10px"
                      variant="flushed"
                      name="weburl"
                      validate={validateWeburl}
                    />
                    {errors.weburl && touched.weburl && <Text fontSize="12px" color="#ea6f5a" mt="5px">{errors.weburl}</Text>}
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onClose} size="sm" mr={3} fontWeight="none" variant="outline">取消</Button>
                  <Button colorScheme="blue" size="sm" fontWeight="none" variant="solid" type="submit" onClick={onClose}>
                    完成
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  )
}

export default function Home() {
  return (
    <ChakraProvider>
      <Container px="0px" w="561px" maxW="init">
        <LogoImage />
        <SeachInput />
        <Shortcut />
      </Container>
    </ChakraProvider>
  )
}

import { HStack, VStack } from '@chakra-ui/react'

import { NextSeo } from 'next-seo'

import HorizontalScroll from 'components/Landing/HorizontalScroll'
import StarBox from 'components/Landing/StarBox'
import MainContent from 'components/Landing/MainContent'
import ExampleKytes from 'components/Landing/ExampleKytes'
import LandingHeader from 'components/Headers/LandingHeader'

const Home = () => {
  return (
    <>
      <NextSeo
        title="Kytelink - the link for all your links"
        description="Kytelink is an opensource Linktree alternative that allows you to share all your links in one place. Add custom domains, view click statistics and more."
        canonical="https://kytelink.com"
      />

      <VStack minH={{ base: '82vh', md: '95vh' }} justify="space-between">
        <LandingHeader />

        <HStack
          w="full"
          px={{ base: 4, md: 12 }}
          p={4}
          color="black"
          spacing={8}
          justify="space-between"
          textAlign="center"
        >
          <VStack w="lg" align="left" textAlign="left" spacing={6}>
            <StarBox />
            <MainContent />
          </VStack>
          <ExampleKytes />
        </HStack>

        <HorizontalScroll />
      </VStack>
    </>
  )
}

export default Home

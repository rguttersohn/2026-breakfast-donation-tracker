<script lang="ts" setup>

const store = useStore();
const config = useRuntimeConfig();

onMounted(async () => {
  
  store.csvObject.value = await fetchDonations();

  window.setInterval(async ()=>{

    store.csvObject.value = await fetchDonations();

  }, Number(config.public.fetchInterval) || 60000);

});


async function handleFullScreenRequested(){

  try{
    
    const container = document.querySelector('#container');

    if(!container){

        throw Error('No container element found');
    }

    await container.requestFullscreen();

  } catch(error: unknown){

    alert("An error occurred while trying to switch into fullscreen mode");

  }
  

}

</script>

<template>
  <UApp>
    <main 
      id="container"
      class="w-screen h-screen px-10 [&:fullscreen]:px-0 bg-primary-900 full-screen"
    >
      <div class="relative p-10 h-full">
        <div class="absolute inset-0 bg-primary-50"></div>
        <div 
          class="absolute top-0 w-3/4 h-[50vh] opacity-66 bg-map">
        </div>
        <LazyBanner hydrate-never/>
        <div class="flex flex-col justify-around h-11/12">
          <LazyHeader hydrate-never/>
          <UPageGrid class="lg:grid-cols-12 gap-x-30">
            <TotalRaised class="col-start-1 col-span-8"/>
            <LazyQrCode hydrate-never class="col-span-4"/>
          </UpageGrid>
        </div>
        <LazyFooter hydrate-never class="relative z-10"/>
      </div>
    </main>
    <UButton
      label="Full Screen"
      size="xs"
      variant="solid"
      @click="handleFullScreenRequested"
      :ui="{
        base: 'absolute right-0 top-0 mr-1 mt-1 w-fit'
      }"
    />
  </UApp>
</template>

<style scoped>

  .bg-map {
      background: 
          radial-gradient(ellipse at top left, rgba(255, 255, 255, 0) 10%, var(--color-blue-50) 80%),    
          url('/img/nyc-bg.png');
      background-repeat: no-repeat;
      background-position: 0 0, 30% 56%;
      background-size: cover, 135%;
  }

</style>

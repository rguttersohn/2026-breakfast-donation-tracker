<script lang="ts" setup>

const store = useStore();
const config = useRuntimeConfig();

onMounted(async () => {
  
  store.csvObject.value = await fetchDonations();

  window.setInterval(async ()=>{

    store.csvObject.value = await fetchDonations();

  }, Number(config.public.fetchInterval) || 60000);

});

</script>

<template>
  <UApp>
    <UPageGrid 
      as="main" 
      class="lg:grid-cols-14 w-screen h-screen overflow-hidden bg-primary-900"
    >
      <div class="relative col-start-2 col-span-12 p-10">
        <div class="absolute inset-0 bg-primary-50"></div>
        <div 
          class="absolute top-0 w-3/4 h-[50vh] opacity-66 bg-map">
        </div>
        <Banner/>
        <div class="flex flex-col justify-around h-full">
          <Header/>
          <UPageGrid class="lg:grid-cols-12 gap-x-30">
            <TotalRaised class="col-start-1 col-span-8"/>
            <QrCode class="col-span-4"/>
          </UpageGrid>
        </div>
      </div>
    </UPageGrid>
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

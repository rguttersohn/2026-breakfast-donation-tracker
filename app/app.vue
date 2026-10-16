<script lang="ts" setup>

const store = useStore();
const config = useRuntimeConfig();

onMounted(async () => {
  
  store.csvObject.value = await fetchDonations();

  window.setInterval(async ()=>{

    store.csvObject.value = await fetchDonations();

  }, parseInt(config.public.fetchInterval));

});

</script>

<template>
  <UApp>
   
    <UPageGrid as="main" class="lg:grid-cols-14 w-screen h-screen bg-primary-900">
      <div class="relative col-start-2 col-span-12 p-10">
        <div class="absolute inset-0 bg-white"></div>
        <div 
          class="absolute top-0 w-3/4 h-[50vh] opacity-66 bg-map">
        </div>
        <div class="relative z-10 flex justify-between flex-wrap py-10">
          <p class="font-bold">Citizens’ Committee for Children of New York</p>
          <p class="uppercase">Celebration Breakfast 2026</p>
          <div class="basis-full h-1 w-full border-b border-primary-900"></div>
        </div>
        <hgroup class="relative z-10">
          <p>Begin with data. Drive Change for Children.</p>
          <h1>Help power the future of <br><span class="text-[5rem] italic">Keeping Track.</span></h1>
        </hgroup>
        <UPageGrid class="lg:grid-cols-10">
          <div class="col-start-1 col-span-7" >
            <p>One City. One Trusted Data Source.</p>
            <p>Total raised, included pledges:</p>
            <p class="text-[10rem] font-bold text-primary-900">{{ store.total_string }}</p>
            <ComparisonBar/>
            <p>{{ store.total_percent }} of goal</p>
          </div>
          <div class="col-span-3">
            <img src="/img/giving-qr.png" alt="">
          </div>
        </UpageGrid>
      </div>
    </UPageGrid>
  </UApp>
</template>

<style scoped>

    .bg-map {
        background: 
            radial-gradient(ellipse at top left, rgba(255, 255, 255, 0) 0%, #fff 90%),    
            url('/img/nyc-bg.png');
        background-position: 0 0, 1vw 66%;
        background-size: cover, cover;
    }

</style>

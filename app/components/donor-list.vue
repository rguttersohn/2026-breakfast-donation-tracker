<script lang="ts" setup>

    const store = useStore();

</script>

<template>
    <UCarousel
        ref="carousel"
        v-slot="{ item }"
        loop
        :autoplay="{ delay: 3000 }"
        :items="store.donors.value"
        :ui="{
            viewport: '[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]',
            container: 'h-[300px] w-full',
            item: 'basis-1/3 w-full'
        }"
        orientation="vertical"
        >
        <div 
            v-if="item" 
            class="p-[15px] border border-primary-100 bg-white rounded-sm"
        >
            <p>{{ item.donor }}</p>
            <p class="text-xl">{{ item.amount }} ({{ item.type }})</p>
        </div>
    </UCarousel>
</template>
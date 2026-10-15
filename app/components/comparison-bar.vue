<script lang="ts" setup>

const store = useStore();

</script>


<template>
    <div class="relative h-10 w-full bg-primary-100 rounded-full">
        <div class="absolute h-full left-0 top-0 bg-primary-900 rounded-full transition-[width] ease-in-out duration-1000" :style="{
            width: store.total_percent.value
        }"></div>
    </div>
</template>
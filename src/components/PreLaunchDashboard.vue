<template>
  <div class="space-y-3 a3-theme">

    <!-- ROW 1: Countdown + Mission Overview -->
    <div class="row-a3-1">
      <LaunchCountdown  class="r-countdown tile-dark"  :mission="mission" />
      <MissionOverview  class="r-overview tile-warm"  :mission="mission" />
    </div>

    <!-- ROW 2: Milestones + News + Weather -->
    <div class="row-a3-2">
      <MilestoneTracker class="r-milestones tile-cool" :mission="mission" />
      <A3NewsPanel      class="r-news      tile-warm"  :mission="mission" />
      <A3SpaceWeather   class="r-weather   tile-cool"  :spaceWeather="spaceWeather" />
    </div>

    <!-- ROW 3: Hardware Tracker + NASA TV -->
    <div class="row-a3-3">
      <HardwareTracker class="r-hardware" :mission="mission" />
      <NASATVPanel     class="r-tv" />
    </div>

    <!-- ROW 4: Mission Comparator (full width) -->
    <MissionComparator />

    <!-- ROW 5: Costs + Lunar Site -->
    <div class="row-a3-5">
      <A3CostPanel    class="r-costs" />
      <LunarSitePanel class="r-lunar" />
    </div>

    <!-- ROW 6: Media Gallery (full width) -->
    <MediaGallery :mission="mission" />

  </div>
</template>

<script setup>
import LaunchCountdown  from './artemis3/LaunchCountdown.vue'
import MissionOverview  from './artemis3/MissionOverview.vue'
import MilestoneTracker from './artemis3/MilestoneTracker.vue'
import A3NewsPanel      from './artemis3/A3NewsPanel.vue'
import MediaGallery     from './artemis3/MediaGallery.vue'
import A3SpaceWeather   from './artemis3/A3SpaceWeather.vue'
import HardwareTracker  from './artemis3/HardwareTracker.vue'
import NASATVPanel      from './artemis3/NASATVPanel.vue'
import MissionComparator from './artemis3/MissionComparator.vue'
import A3CostPanel      from './artemis3/A3CostPanel.vue'
import LunarSitePanel   from './artemis3/LunarSitePanel.vue'

defineProps({ mission: Object, spaceWeather: Array })
</script>

<style scoped>
.row-a3-1 { display: grid; grid-template-columns: 3fr 2fr; gap: 12px; }
.row-a3-2 { display: grid; grid-template-columns: 2fr 3fr 2fr; gap: 12px; }
.row-a3-3 { display: grid; grid-template-columns: 3fr 2fr; gap: 12px; }
.row-a3-5 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

@media (max-width: 1100px) {
  .row-a3-1, .row-a3-3 { grid-template-columns: 1fr; }
  .row-a3-2 { grid-template-columns: 1fr 1fr; }
  .row-a3-5 { grid-template-columns: 1fr; }
}
@media (max-width: 680px) {
  .row-a3-1, .row-a3-2, .row-a3-3, .row-a3-5 { grid-template-columns: 1fr; }
}
</style>

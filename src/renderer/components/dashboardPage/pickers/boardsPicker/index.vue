<template>
  <div class="boards-picker">
    <el-select
      v-model="selectedBoardId"
      class="fluid"
      placeholder="Select board"
      filterable
    >
      <el-option
        v-for="item in boards"
        :key="item.id"
        :label="`${item.name} - ${item.location.name}`"
        :value="item.id"
      />
    </el-select>
    <preloader-bar v-wait:visible="'boardsLoading'"/>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      boards: state => state.boards.boards,
      currentBoard: state => state.boards.selectedBoardId
    }),
    selectedBoardId: {
      get () {
        return this.currentBoard
      },
      set (value) {
        this.clearFilters()
        this.setSelectedBoard(value)
      }
    }
  },
  watch: {
    selectedBoardId: {
      immediate: true,
      handler () {
        this.fetchSprints()
      }
    }
  },
  created () {
    this.fetchBoards()
  },
  methods: {
    ...mapActions({
      fetchBoards: 'boards/fetchBoards',
      fetchSprints: 'sprints/fetchSprints'
    }),
    ...mapMutations({
      setSelectedBoard: 'boards/setSelectedBoard',
      setSprints: 'sprints/setSprints',
      clearFilters: 'filters/clearFilters'
    })
  }
}
</script>
<style lang="scss" scoped>
  .boards-picker {
    position: relative;
    margin-bottom: 7px;
  }
</style>

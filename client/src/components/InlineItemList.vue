<template>
  <div class="inline-item-list">
    <div
      v-for="item in items"
      class="inline-item-list-element"
      v-bind:key="provideId(item)"
    >
      {{ provideLabel(item) }}
      <span class="item-delete" v-on:click="deleteItem">x</span>
    </div>
    <typeahead-input
      :items="suggestItems"
      :itemProjection="provideLabel"
      :addNewHandler="addNewHandler"
      :value="typeaheadValue"
      :v-model="typeaheadValue"
      :resetOnSelect="true"
      @selectItem="selectItem"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import TypeaheadInput from "./TypeaheadInput.vue";

@Component({
  components: { TypeaheadInput },
})
export default class InlineItemList extends Vue {
  @Prop({ required: true })
  suggestItems!: unknown[];

  @Prop({ required: true })
  items!: unknown[];

  @Prop({ required: true })
  provideLabel!: (item: unknown) => string;

  @Prop({ required: true })
  provideId!: (item: unknown) => string;

  @Prop({ required: false, default: undefined })
  addNewHandler?: (name: string) => Promise<void>;

  typeaheadValue = "";

  deleteItem(item: unknown): void {
    this.items.splice(this.items.indexOf(item), 1);
  }

  selectItem(item: unknown): void {
    this.items.push(item);
    this.typeaheadValue = "";
    this.$emit("itemSelected", item);
  }
}
</script>

<style lang="scss" scoped>
.inline-item-list {
  .simple-typeahead {
    display: inline-block;
    width: 150px;
  }

  .inline-item-list-element {
    display: inline-block;
    background-color: #17a2b8;
    border-color: #17a2b8;
    line-height: 2.3;
    border-radius: 0.25rem;
    color: white;
    padding-left: 10px;
    padding-right: 10px;
    margin-right: 10px;
    margin-bottom: 5px;

    .item-delete {
      padding-left: 5px;
      margin-top: 0;
      padding-right: 5px;
      margin-bottom: 0;
      display: inline-block;
    }
    .item-delete:hover {
      color: gray;
    }
  }
}
</style>
'use client';

import * as Gantt from '@repo/gantt';
import type { Feature } from '@repo/gantt/types/types';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/shadcn-ui/components/ui/avatar';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@repo/shadcn-ui/components/ui/context-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@repo/shadcn-ui/components/ui/hover-card';
import { Separator } from '@repo/shadcn-ui/components/ui/separator';
import { EyeIcon, LinkIcon, TrashIcon } from 'lucide-react';
import type { FC } from 'react';
import { toast } from 'sonner';
import { exampleFeatures, exampleMarkers } from '../lib/content';

export const GanttExample: FC = () => {
  const groupedFeatures: Record<string, Feature[]> = {
    features: exampleFeatures,
  };

  const sortedGroupedFeatures = Object.fromEntries(
    Object.entries(groupedFeatures).sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB)
    )
  );

  const handleViewFeature = (id: string) =>
    toast.success(`Feature selected: ${id}`);

  const handleCopyLink = (id: string) => toast.success(`Copy link: ${id}`);

  const handleRemoveFeature = (id: string) =>
    toast.success(`Remove feature: ${id}`);

  const handleRemoveMarker = (id: string) =>
    toast.success(`Remove marker: ${id}`);

  const handleCreateMarker = (date: Date) =>
    toast.success(`Create marker: ${date.toISOString()}`);

  return (
    <Gantt.Provider
      features={exampleFeatures}
      editable
      grouping="feature"
      onAddItem={console.log}
      onMoveItem={console.log}
      range="monthly"
      zoom={100}
    >
      <Gantt.Sidebar onSelectItem={handleViewFeature} />
      <Gantt.Timeline>
        <Gantt.Header />
        <Gantt.FeatureList>
          {Object.entries(sortedGroupedFeatures).map(([group, features]) => (
            <Gantt.FeatureListGroup key={group}>
              {features.map((feature) => (
                <HoverCard key={feature.id}>
                  <HoverCardTrigger asChild>
                    <div>
                      <ContextMenu>
                        <ContextMenuTrigger asChild>
                          <button
                            type="button"
                            onClick={() => handleViewFeature(feature.id)}
                          >
                            <Gantt.FeatureItem key={feature.id} {...feature} />
                          </button>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem
                            className="flex items-center gap-2"
                            onClick={() => handleViewFeature(feature.id)}
                          >
                            <EyeIcon
                              size={16}
                              className="text-muted-foreground"
                            />
                            View feature
                          </ContextMenuItem>
                          <ContextMenuItem
                            className="flex items-center gap-2"
                            onClick={() => handleCopyLink(feature.id)}
                          >
                            <LinkIcon
                              size={16}
                              className="text-muted-foreground"
                            />
                            Copy link
                          </ContextMenuItem>
                          <ContextMenuItem
                            className="flex items-center gap-2 text-destructive"
                            onClick={() => handleRemoveFeature(feature.id)}
                          >
                            <TrashIcon size={16} />
                            Remove from roadmap
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent align="start" className="space-y-1">
                    <p className="font-medium text-xs">{feature.name}</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: feature.status.color }}
                      />
                      <p className="text-xs">{feature.status.name}</p>
                    </div>
                    <Separator />
                    {feature.owner && (
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={feature.owner.image} />
                          <AvatarFallback>
                            {feature.owner.name?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs">{feature.owner.name}</p>
                      </div>
                    )}
                  </HoverCardContent>
                </HoverCard>
              ))}
            </Gantt.FeatureListGroup>
          ))}
        </Gantt.FeatureList>
        {exampleMarkers.map((marker) => (
          <Gantt.Marker
            key={marker.id}
            {...marker}
            onRemove={handleRemoveMarker}
          />
        ))}
        <Gantt.Today />
        <Gantt.CreateMarkerTrigger onCreateMarker={handleCreateMarker} />
      </Gantt.Timeline>
    </Gantt.Provider>
  );
};

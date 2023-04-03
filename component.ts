import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-force-directed-graph',
  templateUrl: './force-directed-graph.component.html',
  styleUrls: ['./force-directed-graph.component.css'],
})
export class ForceDirectedGraphComponent implements OnInit {
  nodes;
  node;
  links;
  link;
  svg;
  simulation;
  nextNodeId = 5; // 1. Initialize next ID

  ngOnInit(): void {
    const width = 1000;
    const height = 1000;

    this.nodes = [
      { id: 1, x: 0, y: 0 },
      { id: 2, x: 0, y: 0 },
      { id: 3, x: 1, y: 1 },
      { id: 4, x: 10, y: 1 },
    ];

    this.links = [
      { source: 1, target: 2 },
      { source: 1, target: 3 },
      { source: 1, target: 4 },
    ];

    this.svg = d3
      .select('#figure')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    this.simulation = d3
      .forceSimulation(this.nodes)
      .force(
        'link',
        d3
          .forceLink(this.links)
          .id((d) => d['id'])
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2));

    this.link = this.svg
      .selectAll('.link')
      .data(this.links)
      .enter()
      .append('line')
      .attr('stroke', '#999');

    this.node = this.svg
      .selectAll('.node')
      .data(this.nodes)
      .join('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .call(this.drag(this.simulation))
      .on('click', (event, d) => {
        let newNodeId = this.nodes.length + 1;
        console.log(newNodeId);
        const newNode1 = { id: newNodeId++, x: d.x + 20, y: d.y + 10 };
        const newNode2 = { id: newNodeId++, x: d.x - 20, y: d.y + 10 };
        const newNode3 = { id: newNodeId++, x: d.x + 20, y: d.y - 10 };
        const newNode4 = { id: newNodeId++, x: d.x - 20, y: d.y - 10 };
        console.log(newNodeId);
        this.nodes.push(newNode1);
        this.nodes.push(newNode2);
        this.nodes.push(newNode3);
        this.nodes.push(newNode4);

        const newLink1 = { source: d.id, target: newNode1.id };
        const newLink2 = { source: d.id, target: newNode2.id };
        const newLink3 = { source: d.id, target: newNode3.id };
        const newLink4 = { source: d.id, target: newNode4.id };

        this.links.push(newLink1);
        this.links.push(newLink2);
        this.links.push(newLink3);
        this.links.push(newLink4);

        this.updateSimulation();
      });

    // this.link = this.svg
    //   .selectAll('.link')
    //   .data(this.links)
    //   .join('line')
    //   .attr('stroke', '#999');

    this.simulationCall();
  }

  simulationCall() {
    this.simulation.on('tick', () => {
      this.link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      this.node // Update position of nodes
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);
    });
  }

  updateSimulation() {
    // Remove old links
    this.link = this.link.data(this.links);
    this.link.exit().remove();

    // Create new links
    this.link = this.link
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .merge(this.link);

    // this.link = this.svg
    //   .selectAll('.link')
    //   .data(this.links)
    //   .join('line')
    //   .attr('stroke', '#999');

    this.node = this.svg
      .selectAll('.node')
      .data(this.nodes)
      .join('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .call(this.drag(this.simulation))
      .on('click', (event, d) => {
        let newNodeId = this.nodes.length + 1;
        console.log(newNodeId);
        const newNode1 = { id: newNodeId++, x: d.x + 20, y: d.y + 10 };
        const newNode2 = { id: newNodeId++, x: d.x - 20, y: d.y + 10 };
        const newNode3 = { id: newNodeId++, x: d.x + 20, y: d.y - 10 };
        const newNode4 = { id: newNodeId++, x: d.x - 20, y: d.y - 10 };
        console.log(newNodeId);
        this.nodes.push(newNode1);
        this.nodes.push(newNode2);
        this.nodes.push(newNode3);
        this.nodes.push(newNode4);

        const newLink1 = { source: d.id, target: newNode1.id };
        const newLink2 = { source: d.id, target: newNode2.id };
        const newLink3 = { source: d.id, target: newNode3.id };
        const newLink4 = { source: d.id, target: newNode4.id };

        this.links.push(newLink1);
        this.links.push(newLink2);
        this.links.push(newLink3);
        this.links.push(newLink4);

        this.updateSimulation();
      });

    this.simulation.nodes(this.nodes);
    this.simulation.force('link').links(this.links);
    this.simulation.alpha(1).restart();
  }

  drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }
}
